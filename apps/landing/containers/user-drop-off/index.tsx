"use client";

export function UserDropOff() {
  return (
    <main className="overflow-x-hidden">
      <section className="relative z-10">
        <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
          <div className="relative mx-auto flex  flex-col lg:block">
            <div className="flex flex-col items-center justify-center mx-auto text-center">
              <h2 className="mt-8 text-balance text-4xl font-medium md:text-5xl lg:mt-16 xl:text-6xl">
                See exactly where users drop off
              </h2>
              <p className="mt-8 max-w-2xl text-pretty text-lg">
                Get a real-time view of your onboarding funnel with session
                replays, user traits, and AI-powered insights that tell you
                exactly what to fix first.
              </p>
              <div className="mt-12 h-[600px] w-full bg-red-500 flex flex-col items-center justify-center gap-2 sm:flex-row"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
