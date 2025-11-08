"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const { data: profile } = authClient.useSession();
  const router = useRouter();

  const { open } = useSidebar();

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-0" asChild>
        <Button variant="ghost" className="w-full h-fit py-2 has-[>svg]:px-0">
          <Avatar className="h-8 w-8 bg-red-500">
            <AvatarFallback className="">
              {profile?.user?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {open && (
            <>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-heading">
                  {profile?.user?.name || "User"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
