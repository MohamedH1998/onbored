import { BackgroundRippleEffect } from "@/components/backgrounds/ripple-effect";
import Section from "@/components/section";
import Hero from "@/components/hero";
import React from "react";

const Page = () => {
  return (
    <div className="relative min-h-screen bg-white ">
      <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(45deg,transparent_48%,#E7E5E4_49%,#E7E5E4_51%,transparent_52%)] bg-[length:20px_20px]" />
      <main className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto bg-white">
          <BackgroundRippleEffect rows={20} cols={28} cellSize={45} />
          <Section>
            <Hero />
          </Section>
        </div>
        <hr className="border-1 border-stone-300" />
      </main>
    </div>
  );
};

export default Page;
