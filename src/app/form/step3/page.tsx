"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useMultistepFormContext } from "../multistep-form-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputData, inputDataSchema } from "@/types/input-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Step3() {
  const router = useRouter();
  const { formData, clearFormData } = useMultistepFormContext();
  const form = useForm({
    resolver: zodResolver(inputDataSchema),
    defaultValues: formData,
  });

  const errors = form.formState.errors;
  const hasErrors = Object.keys(errors).length > 0;

  const onBack = () => {
    router.push("/form/step2");
  };

  const onSubmit = (data: Partial<InputData>) => {
    const finalFormData = { ...formData, ...data };
    alert(JSON.stringify(finalFormData, null, 2));
    clearFormData();
  };

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[400px]"
        >
          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback</FormLabel>
                <FormControl>
                  <Textarea placeholder="did you like this form?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasErrors && (
            <div className="text-red-500">
              <ul>
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    {field}: {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-row justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onBack}
            >
              Back
            </Button>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
