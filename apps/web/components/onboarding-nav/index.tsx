"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth";

const OnboardingNav = () => {
  const { data: session } = authClient.useSession();

  return (
    <div className="w-full flex items-center justify-between px-10 py-5">
      <Image src="/onbored.svg" alt="onbored" width={50} height={50} />
      {session && (
        <Button
          className="z-[9999]"
          size="sm"
          onClick={() => authClient.signOut()}
        >
          Sign out
        </Button>
      )}
    </div>
  );
};

export default OnboardingNav;
