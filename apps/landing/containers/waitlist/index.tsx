"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { sendEmail } from "@/utils/resend";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters.")
    .max(32, "Email must be at most 32 characters."),
});

export default function WaitlistForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitted(true);
      setIsLoading(true);

      const optimisticToastId = toast("Thanks for joining the waitlist!", {
        description: "We'll be in touch soon.",
      });
      try {
        await sendEmail(value.email);
        setIsLoading(false);
      } catch (error) {
        setIsSubmitted(false);
        setIsLoading(false);

        toast.dismiss(optimisticToastId);
        toast.error("Failed to join waitlist", {
          description: "Please try again or contact support.",
          action: {
            label: "Retry",
            onClick: () => {
              form.reset();
            },
          },
        });
      }
    },
  });

  return (
    <form
      id="waitlist-form"
      className="relative p-1 max-w-xl gap-2 w-full border-stone-300 rounded-md border bg-transparent justify-center items-center rounded-md flex text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel hidden htmlFor={field.name}>
                  Email
                </FieldLabel>
                <Input
                  id={field.name}
                  className="border-none shadow-none h-10 rounded-xs bg-white/50"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Email"
                  autoComplete="on"
                />
                {isInvalid && (
                  <FieldError
                    className="absolute top-14 left-0"
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <Button className="active:scale-95" type="submit" size="sm">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Join beta
      </Button>
    </form>
  );
}
