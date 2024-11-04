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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Step2() {
  const router = useRouter();
  const { formData, updateFormData } = useMultistepFormContext();
  const form = useForm({
    resolver: zodResolver(inputDataSchema.pick({ githubUrl: true })),
    defaultValues: { githubUrl: formData.githubUrl },
  });

  const onBack = () => {
    router.push("/form/step1");
  };

  const onSubmit = (data: Partial<InputData>) => {
    updateFormData(data);
    router.push("/form/step3");
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
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Github</FormLabel>
                <FormControl>
                  <Input placeholder="link to your guthub profile" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              Next
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
