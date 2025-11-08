"use client";

import { useState } from "react";
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
import EaseOutContainer from "@/components/animations/slide-up";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProject } from "@/utils/queries/projects";
import { Loader2 } from "lucide-react";
import { getGradient } from "@/data/constants";
import { useFunnel } from "onbored-js/react";

const formSchema = z.object({
  project: z.string().min(1, "Project is required"),
});

type FormData = z.infer<typeof formSchema>;

export const Project = ({
  workspaceId,
}: {
  workspaceId: string | undefined;
}) => {
  const [isSending, setIsSending] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project: "My Project",
    },
  });

  const router = useRouter();

  const { step, complete } = useFunnel("onboarding");

  const onSubmit = async (data: FormData) => {
    try {
      setIsSending(true);
      const {
        success,
        error,
        data: project,
      } = await createProject({
        name: data.project,
        workspaceId: workspaceId ?? "",
        isOnboarding: true,
      });
      if (!success || !project) {
        throw new Error(error);
      }
      step("project");
      complete({ result: "success" });
      router.push(`/`);
    } catch (error) {
      toast.error("Failed to update project");
      console.error(error);
    }
  };

  // @TODO - use the gradient from the workspace
  const gradient = "oceanic";
  const animatedGradient = getGradient(gradient || "oceanic");

  return (
    <EaseOutContainer>
      <Card
        data-onbored-step="project"
        data-onbored-funnel="onboarding"
        className="border-none bg-transparent w-md"
      >
        <CardHeader className="flex flex-col items-center font-semibold text-lg gap-4">
          <div className={`w-10 h-10 rounded-full ${animatedGradient}`} />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-semibold text-center">
              Create a project
            </h1>
            <p className="text-center text-base text-gray-500 font-medium">
              This is where you'll be able to create and manage your projects.
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
                  name="project"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel hidden>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Project" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                size="lg"
                type="submit"
                disabled={!form.formState.isValid || isSending}
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create Project"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </EaseOutContainer>
  );
};
