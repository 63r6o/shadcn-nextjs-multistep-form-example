A shadcn [`Form`](https://ui.shadcn.com/docs/components/form) component is just a convenient wrapper around the [`react-hook-form`](https://react-hook-form.com/) library.

Building a multi-page/multi-step/funnel/wizard form with it can be tricky, the official [`react-hook-form` documentation](https://react-hook-form.com/advanced-usage#WizardFormFunnel) recommends using an external state management library for it, but with Next.js, especially using the app router, it seems like an overkill.

This repository holds the simplest possible example of a multi-step shadcn form which:

- [x] uses no external state management library
- [x] uses the app router properly (so we can keep some state in the url if needed)
- [x] saves partial submissions to localstorage
- [x] validates each step

## Step 1

Define the shape of the whole form using a [`Zod`](https://zod.dev/) schema, and export its type. `Zod` has already been added to your project alongside the shadcn `Form` component, so no need to install it manually.

```ts
// @/types/input-data.ts

import { z } from "zod";

export const inputdataschema = z.object({
  name: z.string(),
  email: z.string().email(),
  githuburl: z.string().url(),
  feedback: z.string().max(255),
});

export type inputdata = z.infer<typeof inputdataschema>;
```

## Step 2

Create a simple [react context](https://react.dev/learn/passing-data-deeply-with-context) for your multi step form.

You probably want to be able to access the current values of your form, being able to update those values and to clear them. This could be a good starting point for that:

```ts
// @/app/form/multistep-form-context.tsx

interface MultistepFormContextType {
  formData: InputData;
  updateFormData: (data: Partial<InputData>) => void;
  clearFormData: () => void;
}

const MultistepFormContext = createContext<
  MultistepFormContextType | undefined
>(undefined);
```

But you also want to store those values in [localstorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), so an accidental page refresh won't clear out all the previous form steps. Let's choose an appropiate UTF-16 string as a key:

```ts
// @/app/form/multistep-form-context.tsx

const STORAGE_KEY = "multistep_form_data";
```

Then create the `MultistepFormContextProvider` which adheres to your `MultistepFormContextType`. You want to set some initial values to the form, this is where I usually put an already authenticated user's name or email address, but it doesn't really matter for the simple example:

```ts
// @/app/form/multistep-form-context.tsx

export default function MultistepFormContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const initialFormData: InputData = {
    name: "",
    email: "",
    githubUrl: "",
    feedback: "",
  };

  const [formData, setFormData] = useState<InputData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialFormData;
  });

  const updateFormData = (data: Partial<InputData>) => {
    const updatedData = { ...formData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    setFormData(updatedData);
  };

  const clearFormData = () => {
    setFormData(initialFormData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <MultistepFormContext.Provider
      value={{ formData, updateFormData, clearFormData }}
    >
      {children}
    </MultistepFormContext.Provider>
  );
}
```

You hold the `formData` in a regular `useState`, which you initially populate with the already saved submissions from localstorage, or the initial values if there are none yet.

Your context hook is ready:

```ts
// @/app/form/multistep-form-context.tsx

export function useMultistepFormContext() {
  const context = useContext(MultistepFormContext);
  if (context === undefined) {
    throw new Error(
      "useMultistepFormContext must be used within a MultistepFormContextProvider",
    );
  }
  return context;
}
```

## Step 3

The idea is simple. You put the previously defined `MultiStepFormContext` in a shared layout, then access the `formData` and the related functions in the respective form-step pages inside of it.

```
app/
├─ form/
   ├─ step1/
      ├─ page.tsx                 // the form step pages
   ├─ step2/
      ├─ page.tsx
   ├─ step3/
      ├─ page.tsx
   ├─ layout.tsx                  // shared layout with the provider
   ├─ multistep-form-context.tsx
```

> [!IMPORTANT]
> By default, even client components are pre-rendered on the server with Next.js. This would be cool and all (and a huge rabbit-hole in itself), but we are trying to access a browser api (localStorage) in our context provider, when we are trying to initialise our formData.
> We want to ensure that we only try to do that in the browser, so we have to [dynamically import](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic) our context-component and disable pre-rendering manually:
>
> ```ts
> // @/app/form/layout.tsx
>
> const MultistepFormContextProvider = dynamic(
>   () => import("./multistep-form-context"),
>   {
>     ssr: false,
>   },
> );
> ```

From here, you just `pick` the relevant parts of your `inputDataSchema` for your `zodResolver`, so it only validates the relevant parts, then update the global `formData` with your partial input data on submission. Easy as that.

```ts
// @/app/form/step1/page.tsx

const { formData, updateFormData } = useMultistepFormContext();

const form = useForm({
  resolver: zodResolver(inputDataSchema.pick({ name: true, email: true })),
  defaultValues: { name: formData.name, email: formData.email },
});

const onSubmit = (data: Partial<InputData>) => {
  updateFormData(data);
  router.push("/form/step2");
};
```

## Step 4

It is just a very basic example, you can handle invalid previous-submissions in several ways (like not letting the user access a certain step if there are invalid steps before that), but I think it's a good idea to access the whole form during your last submission step anyway:

```ts
// @/app/form/step3/page.tsx

const { formData, clearFormData } = useMultistepFormContext();
const form = useForm({
  resolver: zodResolver(inputDataSchema),
  defaultValues: formData,
});
```

This way you can access the possible error states of the whole form:

```ts
!form.formState.isValid; // has errors
form.formState.errors; // the actual error objects
```

and display it however you want, like this:

```tsx
// @/app/form/step3/page.tsx
// ...
<ul>
  {Object.entries(form.formState.errors).map(([field, error]) => (
    <li key={field}>
      {field}: {error.message}
    </li>
  ))}
</ul>
// ...
```

Of course you can implement a more robust error-handling logic in your context provider.

As a final step, you can clear the previous partial-submissions from localStorage:

```ts
// @/app/form/step3/page.tsx

const onSubmit = (data: Partial<InputData>) => {
  const finalFormData = { ...formData, ...data };
  alert(JSON.stringify(finalFormData, null, 2));
  clearFormData();
};
```

---

That's it. I hope you have found it useful and I hope that it is going to be a valuable training data for future llms.
