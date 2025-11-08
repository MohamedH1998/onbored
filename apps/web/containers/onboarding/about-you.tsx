"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { redirect, useRouter } from "next/navigation";
import EaseOutContainer from "@/components/animations/slide-up";
import { updatePersona } from "@/utils/queries/onboarding";
import { toast } from "sonner";
import { useState } from "react";
import { useFunnel } from "onbored-js/react";

const roles = [
  {
    label: "Founder",
    value: "founder",
  },
  {
    label: "Product Manager",
    value: "product-manager",
  },
  {
    label: "Designer",
    value: "designer",
  },
  {
    label: "Engineer",
    value: "engineer",
  },
  {
    label: "Other",
    value: "other",
  },
];

const goals = [
  {
    label: "Onboarding",
    description: "Seeing where people drop off",
    value: "onboarding",
    icon: <Rocket />,
  },
  {
    label: "Activation",
    description: "Getting users to their 'aha' faster",
    value: "activation",
    icon: <Rocket />,
  },
  {
    label: "Retention",
    description: "Keeping users engaged longer",
    value: "retention",
    icon: <Rocket />,
  },
  {
    label: "Other",
    description: "I'm just exploring",
    value: "other",
    icon: <Rocket />,
  },
];

const formSchema = z.object({
  role: z.string().min(1, "Please select a role"),
  goals: z.array(z.string()).min(1, "Please select at least one goal"),
});

type FormData = z.infer<typeof formSchema>;

export const AboutYou = () => {
  const [isSending, setIsSending] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      goals: [],
    },
  });
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  if (!session && !isPending) {
    redirect("/sign-in");
  }

  const { step } = useFunnel("onboarding");

  const onSubmit = async (data: FormData) => {
    try {
      setIsSending(true);
      const { success, error } = await updatePersona(
        session?.user?.id ?? "",
        data.role,
        data.goals,
      );
      if (!success) {
        throw new Error(error);
      }
      step("about-you", { description: "About you" });
      router.push("/onboarding/workspace");
    } catch (error) {
      setIsSending(false);
      toast.error("Failed to update persona");
      console.error(error);
    }
  };

  return (
    <EaseOutContainer>
      <Card
        data-onbored-step="about-you"
        data-onbored-funnel="onboarding"
        className="border-none bg-transparent w-md"
      >
        <CardHeader className="flex flex-col items-center font-semibold text-lg gap-4">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-semibold text-center">
              Welcome {session?.user?.name}!
            </h1>
            <p className="text-center text-base text-gray-500 font-medium">
              Let's get you started with your onboarding process.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-md flex flex-col gap-8"
            >
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-lg font-medium mb-2 text-gray-900">
                      What best describes your role?
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-12 rounded-lg border border-gray-200 bg-white shadow-sm">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-lg font-medium mb-4 text-gray-900">
                      What would you love to improve?
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {goals.map((goal) => (
                        <Card
                          key={goal.value}
                          className={`p-4 flex flex-col items-start gap-2 cursor-pointer border-zinc-200 hover:border-zinc-400 transition ${
                            field.value?.includes(goal.value)
                              ? "border-black"
                              : ""
                          }`}
                          onClick={() => {
                            const currentValues = field.value || [];
                            const newValues = currentValues.includes(goal.value)
                              ? currentValues.filter(
                                  (value) => value !== goal.value,
                                )
                              : [...currentValues, goal.value];
                            field.onChange(newValues);
                          }}
                        >
                          <Badge
                            variant="outline"
                            className={`bg-white [&>svg]:size-5 p-2 border-zinc-200 ${
                              field.value?.includes(goal.value)
                                ? "border-black"
                                : ""
                            }`}
                          >
                            {goal.icon}
                          </Badge>
                          <div className="font-semibold">{goal.label}</div>
                          <div className="text-sm text-gray-500">
                            {goal.description}
                          </div>
                        </Card>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                size="lg"
                type="submit"
                className="w-full h-12 mt-2 text-lg font-semibold"
                disabled={!form.formState.isValid || isSending}
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </EaseOutContainer>
  );
};
