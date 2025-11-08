import {
  db,
  WorkspaceRole,
  User,
  Workspace,
  Project,
  Environment,
  ApiKey,
} from "./client";

const DEFAULT_USERS = [
  {
    id: "user_01j8x9y2z3k4l5m6n7p8q9r0s1t",
    name: "John Doe",
    email: "john.doe@example.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user_02j8x9y2z3k4l5m6n7p8q9r0s1t",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] as Array<User>;

const DEFAULT_WORKSPACES = [
  {
    id: "workspace_02j8x9y2z3k4l5m6n7p8q9r0s1t",
    name: "TechCorp",
    slug: "techcorp",
    gradient: "sunset",
  },
  {
    id: "workspace_01j8x9y2z3k4l5m6n7p8q9r0s1t",
    name: "FinTech",
    slug: "fintach",
    gradient: "oceanic",
  },
] as Array<Partial<Workspace>>;

const DEFAULT_PROJECTS = [
  {
    id: "project_02j8x9y2z3k4l5m6n7p8q9r0s1t",
    name: "TechCorp Website",
    workspaceId: "workspace_02j8x9y2z3k4l5m6n7p8q9r0s1t",
  },
  {
    id: "project_01j8x9y2z3k4l5m6n7p8q9r0s1t",
    name: "FinTech Dashboard",
    workspaceId: "workspace_01j8x9y2z3k4l5m6n7p8q9r0s1t",
  },
] as Array<Partial<Project>>;

const DEFAULT_ENVIRONMENTS = [
  {
    id: "environment_01j8x9y2z3k4l5m6n7p8q9r0s1t",
    name: "Production",
    slug: "prod",
  },
  {
    id: "environment_02j8x9y2z3k4l5m6n7p8q9r0s1t",
    name: "Development",
    slug: "dev",
  },
] as Array<Partial<Environment>>;

const DEFAULT_API_KEYS = [
  {
    id: "api_key_01j8x9y2z3k4l5m6n7p8q9r0s1t",
    token: "api_key_01j8x9y2z3k4l5m6n7p8q9r0s1t",
    projectId: "project_02j8x9y2z3k4l5m6n7p8q9r0s1t",
    environmentId: "environment_01j8x9y2z3k4l5m6n7p8q9r0s1t",
  },
  {
    id: "api_key_02j8x9y2z3k4l5m6n7p8q9r0s1t",
    token: "api_key_02j8x9y2z3k4l5m6n7p8q9r0s1t",
    projectId: "project_01j8x9y2z3k4l5m6n7p8q9r0s1t",
    environmentId: "environment_02j8x9y2z3k4l5m6n7p8q9r0s1t",
  },
] as unknown as Array<Partial<ApiKey>>;

(async () => {
  try {
    // Create users
    console.log("Creating users...");
    await Promise.all(
      DEFAULT_USERS.map((user) =>
        db.user.upsert({
          where: { email: user.email },
          update: user,
          create: user,
        }),
      ),
    );

    // Create workspaces
    console.log("Creating workspaces...");
    await Promise.all(
      DEFAULT_WORKSPACES.map((workspace) =>
        db.workspace.upsert({
          where: { slug: workspace.slug! },
          update: workspace,
          create: workspace as any,
        }),
      ),
    );

    // Create workspace members (connect users to workspaces)
    console.log("Creating workspace members...");
    const workspaceMembers = await Promise.all(
      DEFAULT_USERS.map((user) =>
        DEFAULT_WORKSPACES.map((workspace) =>
          db.workspaceMember.upsert({
            where: {
              userId_workspaceId: {
                userId: user.id,
                workspaceId: workspace.id!,
              },
            },
            update: {
              role: WorkspaceRole.OWNER,
            },
            create: {
              userId: user.id,
              workspaceId: workspace.id!,
              role: WorkspaceRole.OWNER,
            },
          }),
        ),
      ).flat(),
    );

    // Create projects
    console.log("Creating projects...");
    await Promise.all(
      DEFAULT_PROJECTS.map((project) =>
        db.project.upsert({
          where: { id: project.id! },
          update: project,
          create: project as any,
        }),
      ),
    );

    // Get the workspace member for Jane Smith in TechCorp workspace
    const janeTechCorpMember = workspaceMembers.find(
      (member) =>
        member.userId === "user_02j8x9y2z3k4l5m6n7p8q9r0s1t" &&
        member.workspaceId === "workspace_02j8x9y2z3k4l5m6n7p8q9r0s1t",
    );

    if (!janeTechCorpMember) {
      throw new Error("Workspace member not found for Jane Smith in TechCorp");
    }

    // Create environments
    console.log("Creating environments...");
    await Promise.all(
      DEFAULT_ENVIRONMENTS.map((environment) =>
        db.environment.upsert({
          where: { id: environment.id! },
          update: environment,
          create: environment as any,
        }),
      ),
    );

    // Create api keys
    console.log("Creating api keys...");
    await Promise.all(
      DEFAULT_API_KEYS.map((apiKey) =>
        db.apiKey.upsert({
          where: { id: apiKey.id! },
          update: apiKey,
          create: apiKey as any,
        }),
      ),
    );

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
})();
