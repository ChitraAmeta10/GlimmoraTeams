"use client";

import { Check } from "lucide-react";
import { REGISTRATION_STEPS } from "../data";

interface Props {
  step: number;
}

export function StepProgress({ step }: Props) {
  return (
    <div className="flex items-center">
      {REGISTRATION_STEPS.map((label, i) => {
        const n       = i + 1;
        const done    = step > n;
        const current = step === n;
        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-teal-500 text-white"
                    : current
                    ? "bg-brown-600 text-white ring-4 ring-brown-100"
                    : "bg-beige-200 text-beige-400"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : n}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wide whitespace-nowrap ${
                  current ? "text-brown-700" : done ? "text-teal-600" : "text-beige-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < REGISTRATION_STEPS.length - 1 && (
              <div className="flex-1 mx-2 mb-5">
                <div
                  className={`h-px transition-all duration-300 ${
                    step > n ? "bg-teal-400" : "bg-beige-200"
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
