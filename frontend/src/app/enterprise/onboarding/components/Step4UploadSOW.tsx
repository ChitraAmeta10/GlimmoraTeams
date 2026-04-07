"use client";

import {
  AlertCircle, ArrowLeft, ArrowRight, FileText,
  CheckCircle, Upload, RefreshCw,
} from "lucide-react";
import { Button, Input, Label } from "@/components/ui";

interface Props {
  sowFile: File | null;
  setSowFile: (v: File | null) => void;
  sowDrag: boolean;
  setSowDrag: (v: boolean) => void;
  projectTitle: string;
  setProjectTitle: (v: string) => void;
  isLoading: boolean;
  error: string;
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export function Step4UploadSOW({
  sowFile, setSowFile, sowDrag, setSowDrag,
  projectTitle, setProjectTitle,
  isLoading, error, onComplete, onSkip, onBack,
}: Props) {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-semibold text-brown-900 mb-4">Upload Statement of Work</h3>
        <p className="text-xs text-beige-500 mb-4">
          Our AI engine will parse your SOW, extract deliverables, and generate a project blueprint.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>SOW Document</Label>
            <label
              onDragOver={e => { e.preventDefault(); setSowDrag(true); }}
              onDragLeave={() => setSowDrag(false)}
              onDrop={e => {
                e.preventDefault();
                setSowDrag(false);
                const file = e.dataTransfer.files[0];
                if (file && ACCEPTED_TYPES.includes(file.type) && file.size <= 50 * 1024 * 1024) setSowFile(file);
              }}
              className={`flex items-center gap-3 w-full rounded-xl border-2 border-dashed px-4 py-6 cursor-pointer transition-all ${
                sowDrag
                  ? "border-brown-400 bg-brown-50"
                  : sowFile
                  ? "border-teal-300 bg-teal-50"
                  : "border-beige-200 hover:border-beige-300 bg-white"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,.xlsx"
                className="sr-only"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file && file.size <= 50 * 1024 * 1024) setSowFile(file);
                }}
              />
              {sowFile ? (
                <>
                  <FileText className="w-5 h-5 text-teal-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-teal-800 truncate">{sowFile.name}</p>
                    <p className="text-[10px] text-teal-600">{(sowFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 w-full">
                  <Upload className="w-6 h-6 text-beige-300" />
                  <p className="text-sm text-beige-500">Drop file or browse</p>
                  <p className="text-[10px] text-beige-400">PDF, DOCX, XLSX — max 50 MB</p>
                </div>
              )}
            </label>
          </div>
          <div className="space-y-1.5">
            <Label>Project Title <span className="text-beige-400 text-[10px] font-normal">(optional)</span></Label>
            <Input
              placeholder="e.g. Mobile App Redesign Q2 2026"
              value={projectTitle}
              onChange={e => setProjectTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-[10px] text-beige-400">Auto-extracted from SOW if left blank.</p>
          </div>
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
          <Button type="button" variant="outline" size="md" onClick={onBack} disabled={isLoading}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button type="button" variant="outline" size="md" onClick={onSkip} disabled={isLoading}>
            Skip
          </Button>
          <Button type="button" variant="primary" size="md" onClick={onComplete} disabled={isLoading}>
            {isLoading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Setting up...</>
            ) : (
              <>Complete Setup <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
