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

export default function Step1() {
  const router = useRouter();
  const { formData, updateFormData } = useMultistepFormContext();
  const form = useForm({
    resolver: zodResolver(inputDataSchema.pick({ name: true, email: true })),
    defaultValues: { name: formData.name, email: formData.email },
  });

  const onSubmit = (data: Partial<InputData>) => {
    updateFormData(data);
    router.push("/form/step2");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[400px]"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder={"your email address"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}
