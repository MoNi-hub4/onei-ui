"use client";

import { useLayoutEffect } from "react";

export default function ProductLoading() {
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-4 py-5 text-black">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 h-11 w-40 animate-pulse rounded-full bg-white shadow-sm ring-1 ring-black/5" />

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[2.25rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[1.75rem] bg-[#f4f4f4]">
              <div className="absolute left-5 top-5 h-8 w-28 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-[280px] w-[70%] animate-pulse rounded-[2rem] bg-neutral-200" />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-2xl bg-[#f4f4f4] ring-1 ring-black/5"
                />
              ))}
            </div>
          </div>

          <div className="rounded-[2.25rem] bg-white p-6 shadow-sm ring-1 ring-black/5 lg:p-8">
            <div className="mb-5 flex gap-2">
              <div className="h-7 w-20 animate-pulse rounded-full bg-neutral-100" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-neutral-100" />
            </div>

            <div className="h-12 w-4/5 animate-pulse rounded-2xl bg-neutral-100 sm:h-14" />
            <div className="mt-3 h-12 w-3/5 animate-pulse rounded-2xl bg-neutral-100 sm:h-14" />
            <div className="mt-5 h-9 w-40 animate-pulse rounded-2xl bg-neutral-100" />

            <div className="mt-6 space-y-3">
              <div className="h-4 w-full animate-pulse rounded-full bg-neutral-100" />
              <div className="h-4 w-11/12 animate-pulse rounded-full bg-neutral-100" />
              <div className="h-4 w-8/12 animate-pulse rounded-full bg-neutral-100" />
            </div>

            <div className="mt-8">
              <div className="mb-3 h-4 w-32 animate-pulse rounded-full bg-neutral-100" />
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 w-36 animate-pulse rounded-2xl bg-neutral-50"
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-2xl bg-neutral-50"
                />
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="h-14 animate-pulse rounded-2xl bg-neutral-200 sm:flex-1" />
              <div className="h-14 animate-pulse rounded-2xl bg-neutral-100 sm:flex-1" />
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[2.25rem] bg-white p-6 shadow-sm ring-1 ring-black/5 lg:p-8">
          <div className="mb-5 h-8 w-48 animate-pulse rounded-2xl bg-neutral-100" />

          <div className="overflow-hidden rounded-3xl border border-black/5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid border-b border-black/5 last:border-b-0 sm:grid-cols-[240px_1fr]"
              >
                <div className="h-14 animate-pulse bg-neutral-50" />
                <div className="h-14 animate-pulse bg-white" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
