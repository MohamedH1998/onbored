"use client";

import Image from "next/image";
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
import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { createWorkspace } from "@/utils/queries/workspaces";
import { Loader2, CheckCircle, X } from "lucide-react";
import { useFunnel } from "onbored-js/react";
import { useWorkspaceNameValidation } from "@/hooks/use-workspace-name-validation";

const formSchema = z.object({
  workspace: z.string().min(1, "Workspace is required"),
});

type FormData = z.infer<typeof formSchema>;

export const Workspace = () => {
  const [isSending, setIsSending] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspace: "My Workspace",
    },
  });

  const { step } = useFunnel("onboarding");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // Watch the workspace field for real-time validation
  const workspaceName = form.watch("workspace");
  const validation = useWorkspaceNameValidation(
    workspaceName,
    workspaceName.length > 0,
  );

  // Custom validation state for the form
  const isFormValid = form.formState.isValid && validation.isUnique === true;

  const onSubmit = async (data: FormData) => {
    // Final validation check before submission
    if (validation.isUnique !== true) {
      toast.error("Please choose a unique workspace name");
      return;
    }

    try {
      setIsSending(true);
      const { success } = await createWorkspace({
        userId: session?.user?.id ?? "",
        name: data.workspace,
        isOnboarding: true,
      });
      if (!success) {
        throw new Error("Failed to create workspace");
      }
      step("workspace", { description: "workspace" });
      router.push("/onboarding/project");
    } catch (error) {
      toast.error("Failed to update workspace");
      console.error(error);
      setIsSending(false);
    }
  };

  // Helper function to get validation message
  const getValidationMessage = () => {
    if (!workspaceName || workspaceName.trim().length === 0) return null;
    if (validation.isChecking) return "Checking availability...";
    if (validation.error) return validation.error;
    if (validation.isUnique === true) return "Workspace name is available";
    if (validation.isUnique === false) return "Workspace name is already taken";
    return null;
  };

  // Helper function to get validation icon
  const getValidationIcon = () => {
    if (!workspaceName || workspaceName.trim().length === 0) return null;
    if (validation.isChecking)
      return <Loader2 className="w-4 h-4 animate-spin text-gray-500" />;
    if (validation.isUnique === true)
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (validation.isUnique === false)
      return <X className="w-4 h-4 text-red-500" />;
    return null;
  };

  // Helper function to get validation styling
  const getValidationStyling = () => {
    if (!workspaceName || workspaceName.trim().length === 0) return "";
    if (validation.isChecking) return "text-gray-500";
    if (validation.isUnique === true) return "text-green-600";
    if (validation.isUnique === false || validation.error)
      return "text-red-600";
    return "";
  };

  return (
    <EaseOutContainer>
      <Card
        data-onbored-step="workspace"
        data-onbored-funnel="onboarding"
        className="border-none bg-transparent w-md"
      >
        <CardHeader className="flex flex-col items-center font-semibold text-lg gap-4">
          <Image src="/onbored.svg" alt="onbored" width={100} height={100} />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-semibold text-center">
              Create a workspace
            </h1>
            <p className="text-center text-base text-gray-500 font-medium">
              This is where you'll be able to create and manage your workspaces.
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
                  name="workspace"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel hidden>Workspace Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Workspace"
                            type="text"
                            {...field}
                            className={`pr-10 ${
                              validation.isUnique === false || validation.error
                                ? "border-red-500 focus:border-red-500"
                                : validation.isUnique === true
                                  ? "border-green-500 focus:border-green-500"
                                  : ""
                            }`}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {getValidationIcon()}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {getValidationMessage() && (
                        <p className={`text-sm mt-1 ${getValidationStyling()}`}>
                          {getValidationMessage()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <Button
                size="lg"
                type="submit"
                disabled={!isFormValid || isSending || validation.isChecking}
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create Workspace"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </EaseOutContainer>
  );
};
