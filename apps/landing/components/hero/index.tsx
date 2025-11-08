"use client";

import React from "react";
import WaitlistForm from "@/containers/waitlist";

export default function Hero() {
  return (
    <>
      <main className="overflow-x-hidden">
        <section className="relative z-10">
          <div className=" pb-56 pt-44">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
              <div className="text-left">
                <h1 className="mt-8 max-w-3xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl">
                  Know who will churn, before they do
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg">
                  Onbored turns customer behavior into early warnings. See which
                  users are slipping, why they’re leaving, and how to save them
                  before the revenue’s gone.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <WaitlistForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
