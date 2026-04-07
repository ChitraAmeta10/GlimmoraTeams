"use client";

import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Organisation" },
  { n: 2, label: "Administrator" },
  { n: 3, label: "Security" },
  { n: 4, label: "Agreements" },
] as const;

export function EnterpriseStepProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map(({ n, label }, i) => {
        const done    = n < step;
        const active  = n === step;

        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            {/* Step node */}
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
              <span
                className={`text-[10px] font-semibold tracking-wide whitespace-nowrap transition-colors ${
                  done || active ? "text-brown-700" : "text-beige-400"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-2 mb-5">
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
