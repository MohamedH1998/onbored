"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Eye, EyeOff, Trash2, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  createEnvironment,
  deleteEnvironment,
  rotateEnvironmentApiKey,
} from "@/utils/queries/environments";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";
import { useActiveEnvironment } from "@/hooks/use-active-environment";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApiKeyManagement({ projectId }: { projectId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Environment state
  const [newEnvironment, setNewEnvironment] = useState({
    name: "",
    slug: "",
  });
  const [isCreatingEnvironment, setIsCreatingEnvironment] = useState(false);

  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { activeEnvironment, isPending: activeEnvironmentPending } =
    useActiveEnvironment({
      userId: session?.user?.id || "",
      projectId,
      enabled: true,
    });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const maskApiKey = (token: string) => {
    if (token.length <= 8) return token;
    return `${token.substring(0, 8)}${"•".repeat(token.length - 12)}${token.substring(token.length - 4)}`;
  };

  const handleCreateEnvironment = async () => {
    if (!newEnvironment.name || !newEnvironment.slug) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsCreatingEnvironment(true);

    try {
      const { data, success } = await createEnvironment({
        projectId,
        name: newEnvironment.name,
        slug: newEnvironment.slug,
      });

      if (!success || !data) {
        throw new Error("Failed to create environment");
      }

      toast.success("Environment created successfully");
      setNewEnvironment({ name: "", slug: "" });
      queryClient.invalidateQueries({
        queryKey: ["environments"],
        exact: false,
      });
    } catch (error) {
      toast.error("Failed to create environment");
    } finally {
      setIsCreatingEnvironment(false);
    }
  };

  const handleDeleteEnvironment = async (environmentId: string) => {
    if (!confirm("Are you sure you want to delete this environment?")) {
      return;
    }

    try {
      const { success } = await deleteEnvironment(environmentId);

      if (!success) {
        throw new Error("Failed to delete environment");
      }

      toast.success("Environment deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["environments"],
        exact: false,
      });
    } catch (error) {
      toast.error("Failed to delete environment");
    }
  };

  const handleRotateEnvironmentApiKey = async (environmentId: string) => {
    try {
      const { data, success } = await rotateEnvironmentApiKey({
        projectId,
        environmentId,
      });

      if (!success || !data) {
        throw new Error("Failed to rotate API key");
      }

      toast.success("API key rotated successfully");
      queryClient.invalidateQueries({
        queryKey: ["environments"],
        exact: false,
      });
    } catch (error) {
      toast.error("Failed to rotate API key");
    }
  };

  return (
    <div className="space-y-6">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="flex items-center gap-2 justify-self-end">
            <Plus className="h-4 w-4" />
            Create Environment
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Environment</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new environment with its own API key for your project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="env-name" className="text-sm font-medium">
                Environment Name
              </Label>
              <Input
                id="env-name"
                placeholder="e.g., Production, Development"
                value={newEnvironment.name}
                onChange={(e) =>
                  setNewEnvironment({
                    ...newEnvironment,
                    name: e.target.value,
                  })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="env-slug" className="text-sm font-medium">
                Environment Slug
              </Label>
              <Input
                id="env-slug"
                placeholder="e.g., prod, dev"
                value={newEnvironment.slug}
                onChange={(e) =>
                  setNewEnvironment({
                    ...newEnvironment,
                    slug: e.target.value,
                  })
                }
                className="mt-2"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCreateEnvironment}
              disabled={
                isCreatingEnvironment ||
                !newEnvironment.name.trim() ||
                !newEnvironment.slug.trim()
              }
            >
              {isCreatingEnvironment ? "Creating..." : "Create Environment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="overflow-x-auto rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-100">
            <TableRow>
              <TableHead>Environment</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeEnvironmentPending ? (
              <TableRow key="loading">
                <TableCell className="font-medium">
                  <Skeleton className="h-6 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[300px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="h-8 w-8 p-0"
                      title="Rotate API key"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      disabled
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Delete environment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : activeEnvironment ? (
              <TableRow key={activeEnvironment.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {activeEnvironment.name}
                    <Badge variant="secondary">{activeEnvironment.slug}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {visibleKeys.has(activeEnvironment.id)
                        ? activeEnvironment.apiKey.token
                        : maskApiKey(activeEnvironment.apiKey.token)}
                    </code>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleKeyVisibility(activeEnvironment.id)
                        }
                        className="h-8 w-8 p-0"
                        title={
                          visibleKeys.has(activeEnvironment.id)
                            ? "Hide API key"
                            : "Show API key"
                        }
                      >
                        {visibleKeys.has(activeEnvironment.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            activeEnvironment.apiKey.token,
                            "Environment API Key",
                          )
                        }
                        className="h-8 w-8 p-0"
                        title="Copy API key"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {activeEnvironment.apiKey.lastUsedAt
                    ? formatDate(
                        activeEnvironment.apiKey.lastUsedAt.toISOString(),
                      )
                    : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleRotateEnvironmentApiKey(activeEnvironment.id)
                      }
                      className="h-8 w-8 p-0"
                      title="Rotate API key"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      disabled={
                        activeEnvironment.slug === "prod" ||
                        activeEnvironment.slug === "dev"
                      }
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDeleteEnvironment(activeEnvironment.id)
                      }
                      className="h-8 w-8 p-0"
                      title="Delete environment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No environments found. Create your first environment to get
                  started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
