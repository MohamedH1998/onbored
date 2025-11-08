"use client";
import { Project, Workspace, Environment } from "@repo/database";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

type ContextType = {
  workspace: Workspace | null;
  project: Project | null;
  environment: Environment | null;
  hasWorkspace: boolean;
  hasProject: boolean;
  hasEnvironment: boolean;
};

export const Context = createContext<{
  workspace: Workspace | null;
  project: Project | null;
  environment: Environment | null;
  hasWorkspace: boolean;
  hasProject: boolean;
  hasEnvironment: boolean;
  setContext: (context: Partial<ContextType>) => void;
} | null>(null);

export const ContextProvider = ({
  initialContext,
  children,
}: {
  initialContext: ContextType;
  children: React.ReactNode;
}) => {
  const [context, setContext] = useState(initialContext);

  const updateContext = useCallback((updates: Partial<ContextType>) => {
    setContext((prev) => ({ ...prev, ...updates }));
  }, []);

  const contextValue = useMemo(
    () => ({
      ...context,
      setContext: updateContext,
    }),
    [context, updateContext],
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useWorkspaceContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useWorkspaceContext must be used within a ContextProvider",
    );
  }
  return context;
};
