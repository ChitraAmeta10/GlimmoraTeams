"use client";

import {
  AlertCircle, ArrowRight, ArrowLeft, Plus, X,
} from "lucide-react";
import { Button, Input, Label } from "@/components/ui";

interface TeamInvite {
  email: string;
  firstName: string;
  lastName: string;
}

interface Props {
  teamInvites: TeamInvite[];
  addInviteRow: () => void;
  removeInviteRow: (index: number) => void;
  updateInvite: (index: number, field: keyof TeamInvite, value: string) => void;
  error: string;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export function Step3TeamSetup({
  teamInvites, addInviteRow, removeInviteRow, updateInvite,
  error, onContinue, onSkip, onBack,
}: Props) {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-brown-900">Invite Reviewers</h3>
          <span className="text-xs text-beige-400">{teamInvites.length}/10</span>
        </div>

        <p className="text-xs text-beige-500 mb-4">
          Reviewers validate deliverables from contributors. You can add more later from Settings.
        </p>

        <div className="space-y-3">
          {teamInvites.map((inv, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
              <div className="space-y-1">
                <Label className="text-[11px]">Email <span className="text-red-400">*</span></Label>
                <Input
                  type="email"
                  placeholder="reviewer@company.com"
                  value={inv.email}
                  onChange={e => updateInvite(i, "email", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">First Name</Label>
                <Input
                  placeholder="First name"
                  value={inv.firstName}
                  onChange={e => updateInvite(i, "firstName", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Last Name</Label>
                <Input
                  placeholder="Last name"
                  value={inv.lastName}
                  onChange={e => updateInvite(i, "lastName", e.target.value)}
                />
              </div>
              <div className="pb-0.5">
                {teamInvites.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeInviteRow(i)}
                    className="p-2 rounded-lg text-beige-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : <div className="w-8" />}
              </div>
            </div>
          ))}

          {teamInvites.length < 10 && (
            <button
              type="button"
              onClick={addInviteRow}
              className="flex items-center gap-1.5 text-sm text-brown-600 hover:text-brown-800 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add reviewer
            </button>
          )}
        </div>
      </section>

      {/* Actions */}
      <div className="space-y-3 pt-2 border-t border-beige-100">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button type="button" variant="outline" size="md" onClick={onSkip}>
            Skip
          </Button>
          <Button type="button" variant="primary" size="md" onClick={onContinue}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
