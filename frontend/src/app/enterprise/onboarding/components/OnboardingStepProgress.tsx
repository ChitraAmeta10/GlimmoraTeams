"use client";

import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Verification", optional: false },
  { n: 2, label: "Billing & Legal", optional: false },
  { n: 3, label: "Team Setup", optional: true },
  { n: 4, label: "First SOW", optional: true },
] as const;

export function OnboardingStepProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map(({ n, label, optional }, i) => {
        const done = n < step;
        const active = n === step;

        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-brown-600 text-white shadow-sm shadow-brown-200"
                    : active
                    ? "bg-brown-800 text-white ring-4 ring-brown-200 shadow-sm"
                    : "bg-beige-100 text-beige-400 border border-beige-200"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : n}
              </div>
              <div className="flex flex-col items-center">
                <span
                  className={`text-[10px] font-semibold tracking-wide whitespace-nowrap transition-colors ${
                    done || active ? "text-brown-700" : "text-beige-400"
                  }`}
                >
                  {label}
                </span>
                {optional && (
                  <span className="text-[9px] text-beige-400">(optional)</span>
                )}
              </div>
            </div>

            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-2 mb-6">
                <div
                  className={`h-px transition-all duration-300 ${
                    done ? "bg-brown-400" : "bg-beige-200"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
