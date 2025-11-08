"use client";

import Image from "next/image";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import EaseOutContainer from "@/components/animations/slide-up";
import { updateOnboardingProgress } from "@/utils/queries/onboarding";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useFunnel } from "onbored-js/react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type FormData = z.infer<typeof formSchema>;

export const Welcome = () => {
  const [isSending, setIsSending] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });
  const router = useRouter();

  const { step } = useFunnel("onboarding");

  const { data: session } = authClient.useSession();

  const onSubmit = async (data: FormData) => {
    try {
      setIsSending(true);

      const [user, onboardingProgress] = await Promise.all([
        authClient.updateUser({
          name: `${data.firstName} ${data.lastName}`,
        }),
        updateOnboardingProgress({
          userId: session?.user?.id ?? "",
          step: "welcome",
        }),
      ]);
      if (!user || !onboardingProgress.success) {
        throw new Error("Failed to update user name");
      }
      step("welcome");
      router.push("/onboarding/about-you");
    } catch (error: any) {
      setIsSending(false);
      toast.error("Failed to update user name", {
        description: error.message as string,
      });
      console.error(error);
    }
  };

  return (
    <EaseOutContainer>
      <Card
        data-onbored-step="welcome"
        data-onbored-funnel="onboarding"
        className="border-none bg-transparent"
      >
        <CardHeader className="flex flex-col items-center font-semibold text-lg gap-4">
          <Image src="/onbored.svg" alt="onbored" width={100} height={100} />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-semibold text-center">
              Welcome to OnBored
            </h1>
            <p className="text-center text-base text-gray-500 font-medium">
              Let's get you started with your onboarding process.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel hidden>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel hidden>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="z-[999]"
                type="submit"
                disabled={!form.formState.isValid || isSending}
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Get Started"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </EaseOutContainer>
  );
};
