import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";
import { checkWorkspaceName } from "@/utils/queries/workspaces";

interface ValidationResult {
  isUnique: boolean | null;
  isChecking: boolean;
  error: string | null;
}

export const useWorkspaceNameValidation = (name: string, enabled = true) => {
  const [result, setResult] = useState<ValidationResult>({
    isUnique: null,
    isChecking: false,
    error: null,
  });

  const debouncedName = useDebounce(name, 500);

  const checkName = useCallback(async (nameToCheck: string) => {
    if (!nameToCheck || nameToCheck.trim().length === 0) {
      setResult({
        isUnique: null,
        isChecking: false,
        error: null,
      });
      return;
    }

    setResult((prev) => ({ ...prev, isChecking: true, error: null }));

    try {
      const response = await checkWorkspaceName(nameToCheck.trim());

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to check workspace name");
      }

      setResult({
        isUnique: response.data.isUnique,
        isChecking: false,
        error: null,
      });
    } catch (error) {
      setResult({
        isUnique: null,
        isChecking: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to check workspace name",
      });
    }
  }, []);

  useEffect(() => {
    if (enabled && debouncedName) {
      checkName(debouncedName);
    }
  }, [debouncedName, enabled, checkName]);

  return result;
};
