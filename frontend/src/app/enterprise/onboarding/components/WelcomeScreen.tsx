"use client";

import {
  ArrowRight, Building2, CreditCard, Users, FileUp,
  PlayCircle, Shield, CheckCircle,
} from "lucide-react";
import { GlassCard, GlassCardContent, Button } from "@/components/ui";

const WIZARD_STEPS = [
  { Icon: Building2, title: "Company Verification", desc: "Verify your legal entity and registered address" },
  { Icon: CreditCard, title: "Billing & Legal", desc: "Set billing preferences, sign NDA, and accept agreements" },
  { Icon: Users, title: "Team Setup", desc: "Invite Reviewers from your team (optional)" },
  { Icon: FileUp, title: "Upload First SOW", desc: "Start your first project immediately (optional)" },
];

export function WelcomeScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="space-y-5">
      <GlassCard variant="heavy" padding="lg">
        <GlassCardContent>
          <div className="text-center mb-6">
            <h1 className="font-heading text-2xl font-bold text-brown-950">
              Welcome to GlimmoraTeam
            </h1>
            <p className="text-sm text-beige-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              Let&apos;s set up your enterprise workspace. This takes about 5 minutes and ensures
              your projects, billing, and team are ready to go.
            </p>
          </div>

          {/* Video placeholder */}
          <div className="relative w-full aspect-video rounded-2xl bg-brown-950 overflow-hidden mb-6 group cursor-pointer">
            <div className="absolute inset-0 bg-linear-to-br from-brown-800/80 to-brown-950/90 flex flex-col items-center justify-center gap-3">
              <PlayCircle className="w-14 h-14 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
              <p className="text-white/70 text-sm font-medium">Watch: How GlimmoraTeam works for enterprises</p>
              <p className="text-white/40 text-xs">60 seconds</p>
            </div>
          </div>

          {/* What the wizard covers */}
          <div className="space-y-2.5 mb-6">
            <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest mb-3">
              What we&apos;ll set up
            </p>
            {WIZARD_STEPS.map(({ Icon, title, desc }, i) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-beige-50 border border-beige-100">
                <div className="w-8 h-8 rounded-lg bg-brown-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-brown-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-brown-800">
                      Step {i + 1}: {title}
                    </p>
                    {i >= 2 && (
                      <span className="text-[9px] font-medium text-beige-400 bg-beige-100 px-1.5 py-0.5 rounded">Optional</span>
                    )}
                  </div>
                  <p className="text-xs text-beige-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mb-5 text-xs text-beige-400">
            <div className="flex items-center gap-1"><Shield className="w-3 h-3" /><span>256-bit encryption</span></div>
            <span>|</span>
            <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /><span>SOC 2 compliant</span></div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onBegin}
          >
            Begin Setup <ArrowRight className="w-4 h-4" />
          </Button>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
