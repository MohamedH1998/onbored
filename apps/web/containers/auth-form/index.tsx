"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { authClient } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export const AuthForm = () => {
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSending(true);
    try {
      const { error } = await authClient.signIn.magicLink({
        email: data.email,
        callbackURL: "/onboarding/welcome",
      });

      if (error) {
        toast.error("Failed to send magic link. Please try again.");
        return;
      }

      setSubmittedEmail(data.email);
      setEmailSent(true);
      toast.success("Magic link sent! Check your email.");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const signIn = async () => {
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const resetForm = () => {
    setEmailSent(false);
    setSubmittedEmail("");
    form.reset();
  };

  if (emailSent) {
    return (
      <Card className="border-none bg-transparent">
        <CardHeader className="flex flex-col items-center font-semibold text-lg gap-4">
          <Image src="/onbored.svg" alt="onbored" width={100} height={100} />
          <h1 className="text-2xl font-bold">Check your email</h1>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">We've sent a magic link to:</p>
            <p className="font-medium">{submittedEmail}</p>
            <p className="text-sm text-muted-foreground">
              Click the link in your email to sign in to OnBored.
            </p>
          </div>
          <div className="pt-4">
            <Button variant="outline" onClick={resetForm} className="w-full">
              Back to sign in
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-center text-muted-foreground text-sm">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={resetForm}
              className="underline hover:no-underline"
            >
              try again
            </button>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-none bg-transparent">
      <CardHeader className="flex flex-col items-center font-semibold text-lg gap-4">
        <Image src="/onbored.svg" alt="onbored" width={100} height={100} />
        <h1 className="text-2xl font-bold">Welcome to OnBored</h1>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          size="lg"
          variant="outline"
          onClick={signIn}
          className="w-full gap-2 border-black/10"
        >
          <Image
            src="/assets/icons/google.svg"
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
            alt="Google Icon"
          />
          Continue with Google
        </Button>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex items-center gap-2 py-2">
              <Separator className="flex-1" />
              <span className="text-muted-foreground uppercase text-xs">
                Or
              </span>
              <Separator className="flex-1" />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel hidden>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size="lg"
              type="submit"
              disabled={!form.formState.isValid || isSending}
            >
              {isSending ? "Sending..." : "Continue with email"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-muted-foreground text-sm">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="underline hover:no-underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className="underline hover:no-underline" href="/privacy-policy">
            Privacy Policy
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
