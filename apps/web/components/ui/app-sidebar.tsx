"use client";

import {
  ChevronRight,
  CircleHelp,
  Funnel,
  Home,
  Lightbulb,
  LucideIcon,
  Settings2,
  Users,
} from "lucide-react";

import * as React from "react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import UserProfile from "@/components/use-profile";
import { usePathname } from "next/navigation";
import { useWorkspaceContext } from "@/components/context-provider";
import Link from "next/link";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  disabled?: boolean;
  isActive?: boolean;
}

const bottomNavItems = [
  {
    title: "Support",
    url: "mailto:info@onbored.io?subject=PlatformSupport",
    icon: CircleHelp,

    isActive: true,
  },
  {
    title: "Settings",
    url: "#",
    disabled: true,
    icon: Settings2,
  },
] as const satisfies NavItem[];

const NavItem = React.memo(
  ({
    item,
    pathname,
    disabled,
  }: {
    item: any;
    pathname: string;
    disabled: boolean;
  }) => {
    const isActive = (() => {
      if (item.url === "/" && pathname === "/") {
        return true;
      }

      if (pathname === item.url && item.url !== "/") {
        return true;
      }

      if (item.title === "Funnels" && pathname.includes("/funnel")) {
        return true;
      }

      if (item.title === "Accounts" && pathname.includes("/account")) {
        return true;
      }

      return false;
    })();

    return (
      <SidebarMenuButton
        className={`${isActive ? "border border-sidebar-border" : ""}`}
        asChild
        key={item.title}
        disabled={disabled}
        isActive={isActive}
        tooltip={item.title}
      >
        <Link prefetch href={item.url}>
          {item.icon && <item.icon />}
          {item.title}
          {item.items && (
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          )}
        </Link>
      </SidebarMenuButton>
    );
  },
);

NavItem.displayName = "NavItem";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { project, hasWorkspace, hasProject } = useWorkspaceContext();

  const disabled = !hasWorkspace || !hasProject;

  const navItems = React.useMemo(
    () => [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
        isActive: true,
      },
      {
        title: "Accounts",
        url: !project ? "#" : `/project/${project.id}/accounts`,
        icon: Users,
        isActive: true,
      },
      {
        title: "Funnels",
        url: !project ? "#" : `/project/${project.id}/funnel`,
        icon: Funnel,
      },
      {
        title: "Install",
        url: !project ? "#" : `/project/${project.id}/install`,
        icon: Lightbulb,
      },
    ],
    [project?.id],
  ) as NavItem[];

  return (
    <Sidebar collapsible="icon" {...props} className="border-none bg-sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 overflow-hidden">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <Image
                src="/onbored.svg"
                alt="onbored"
                width={32}
                height={32}
                priority
              />
            </div>
            <span className="font-semibold text-2xl">Onbored</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.title}
                item={item}
                pathname={pathname}
                disabled={item?.disabled || disabled}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarGroup className="px-0">
            <SidebarMenu className="space-y-1">
              {bottomNavItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  pathname={pathname}
                  disabled={disabled}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarMenuItem>
            <UserProfile />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
