"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileUp, CheckCircle2, X, File, FileType, Loader2, ArrowRight,
  Search, Brain, LayoutList, AlertTriangle, ShieldCheck, Sparkles, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";

/* ═══ Parsing stages ═══ */

type ParsingStage = null | "uploading" | "extracting" | "analyzing" | "detecting" | "scoring" | "complete";

const PARSING_STAGES: { key: ParsingStage; label: string; icon: React.ElementType; description: string }[] = [
  { key: "uploading", label: "Uploading", icon: Upload, description: "Transferring to secure storage" },
  { key: "extracting", label: "Text Extraction", icon: Search, description: "OCR & content extraction" },
  { key: "analyzing", label: "NLP Analysis", icon: Brain, description: "Language processing pipeline" },
  { key: "detecting", label: "Section Detection", icon: LayoutList, description: "Scope, budget, timeline, risks" },
  { key: "scoring", label: "Gap & Risk Scoring", icon: ShieldCheck, description: "Completeness & ambiguity check" },
];

function getStageIndex(stage: ParsingStage): number {
  if (!stage) return -1;
  if (stage === "complete") return PARSING_STAGES.length;
  return PARSING_STAGES.findIndex((s) => s.key === stage);
}

function getProgressPercent(stage: ParsingStage): number {
  if (!stage) return 0;
  if (stage === "complete") return 100;
  const idx = getStageIndex(stage);
  return Math.round(((idx + 0.5) / PARSING_STAGES.length) * 100);
}

/* ═══ File helpers ═══ */

const ACCEPTED_EXTENSIONS = ".pdf,.docx,.doc";

function getFileTypeLabel(file: File): string {
  if (file.name.endsWith(".pdf")) return "PDF";
  if (file.name.endsWith(".docx")) return "DOCX";
  if (file.name.endsWith(".doc")) return "DOC";
  return "Document";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ═══ Mock results ═══ */

const MOCK_RESULTS = {
  sectionsDetected: 14, aiConfidence: 92, gapScore: 88,
  ambiguities: 3, estimatedBudget: "$310,000", estimatedDuration: "7 months",
};

/* ═══ PAGE ═══ */

export default function SOWUploadPage() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [parsingStage, setParsingStage] = React.useState<ParsingStage>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isParsing = parsingStage !== null && parsingStage !== "complete";
  const isComplete = parsingStage === "complete";

  const handleFileSelect = (file: File) => {
    const ext = file.name.toLowerCase();
    if (!ext.endsWith(".pdf") && !ext.endsWith(".docx") && !ext.endsWith(".doc")) return;
    setSelectedFile(file);
    setParsingStage(null);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFileSelect(file); e.target.value = ""; };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) handleFileSelect(file); };
  const handleReset = () => { setSelectedFile(null); setParsingStage(null); };

  const startParsing = () => {
    if (!selectedFile || isParsing) return;
    const stages: ParsingStage[] = ["uploading", "extracting", "analyzing", "detecting", "scoring", "complete"];
    stages.forEach((stage, i) => { setTimeout(() => setParsingStage(stage), i * 600); });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <input ref={fileInputRef} type="file" accept={ACCEPTED_EXTENSIONS} onChange={handleInputChange} className="hidden" aria-hidden="true" />

      {/* Header */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight">Upload Statement of Work</h1>
        <p className="mt-1.5 text-[13px] text-gray-500">Upload your SOW document and our AI will parse, extract, and structure key sections automatically.</p>
      </motion.div>

      {/* ═══ STATE 1: No file — Drop zone ═══ */}
      {!selectedFile && !isParsing && !isComplete && (
        <motion.div variants={fadeUp}>
          <div
            className={cn("card-parchment cursor-pointer transition-all duration-200", isDragging && "ring-2 ring-brown-200 border-dashed border-2 border-brown-300")}
            style={{ padding: "64px 40px" }}
            onClick={handleBrowseClick}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center mb-6">
                <FileUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-[17px] font-semibold text-gray-900 mb-1.5">Drag & drop your SOW document</h3>
              <p className="text-[13px] text-gray-400 mb-6">or click anywhere to browse your files</p>
              <button onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
                className="flex items-center gap-2 text-[12px] font-medium text-gray-500 px-5 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                <Upload className="w-3.5 h-3.5" /> Browse Files
              </button>
              <div className="flex items-center gap-3 mt-5">
                <span className="text-[10px] text-gray-400">PDF, DOCX, DOC</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-[10px] text-gray-400">Max 50MB</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ STATE 2: File selected — Ready to parse ═══ */}
      {selectedFile && !isParsing && !isComplete && (
        <motion.div variants={fadeUp}>
          <div className="card-parchment px-6 py-6">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                selectedFile.name.endsWith(".pdf") ? "bg-gradient-to-br from-brown-400 to-brown-600" : "bg-gradient-to-br from-teal-400 to-teal-600"
              )}>
                {selectedFile.name.endsWith(".pdf") ? <File className="w-5 h-5 text-white" /> : <FileType className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{getFileTypeLabel(selectedFile)}</span>
                  <span className="text-[11px] text-gray-400">{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleReset}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                  <RotateCcw className="w-3 h-3" /> Change
                </button>
                <button onClick={startParsing}
                  className="flex items-center gap-2 text-[13px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 px-6 py-2.5 rounded-xl transition-all">
                  <Upload className="w-3.5 h-3.5" /> Upload & Parse
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ STATE 3: Parsing — Progress ═══ */}
      <AnimatePresence>
        {isParsing && selectedFile && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <div className="card-parchment px-6 py-6">
              {/* Top info */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-gray-900">Parsing {selectedFile.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{getFileTypeLabel(selectedFile)} · {formatFileSize(selectedFile.size)}</p>
                </div>
                <span className="num-display text-[24px] text-gray-900">{getProgressPercent(parsingStage)}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-6">
                <div className="h-full rounded-full bg-gradient-to-r from-brown-400 to-brown-500 transition-all duration-500" style={{ width: `${getProgressPercent(parsingStage)}%` }} />
              </div>

              {/* Stages */}
              <div className="space-y-1">
                {PARSING_STAGES.map((stage) => {
                  const currentIdx = getStageIndex(parsingStage);
                  const stageIdx = PARSING_STAGES.indexOf(stage);
                  const isActive = stage.key === parsingStage;
                  const isDone = currentIdx > stageIdx;
                  const StageIcon = stage.icon;
                  return (
                    <div key={stage.key} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all",
                      isActive && "bg-brown-50", !isActive && !isDone && "opacity-40"
                    )}>
                      {isDone ? <CheckCircle2 className="w-4 h-4 text-forest-500 shrink-0" /> :
                       isActive ? <Loader2 className="w-4 h-4 text-brown-500 animate-spin shrink-0" /> :
                       <StageIcon className="w-4 h-4 text-gray-400 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <span className={cn("text-[12px] font-medium",
                          isDone ? "text-forest-700" : isActive ? "text-brown-700" : "text-gray-400"
                        )}>{stage.label}</span>
                        <span className="text-[11px] text-gray-400 ml-2">{stage.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ STATE 4: Complete — Results ═══ */}
      <AnimatePresence>
        {isComplete && selectedFile && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Success banner */}
            <div className="card-parchment px-6 py-5 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-gray-900">Parsing Complete</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{selectedFile.name} · {getFileTypeLabel(selectedFile)} · {formatFileSize(selectedFile.size)}</p>
                </div>
                <span className="text-[10px] font-semibold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-full">All stages passed</span>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Sections Detected", value: MOCK_RESULTS.sectionsDetected, icon: LayoutList, iconBg: "bg-gradient-to-br from-brown-400 to-brown-600" },
                { label: "AI Confidence", value: `${MOCK_RESULTS.aiConfidence}%`, icon: Sparkles, iconBg: "bg-gradient-to-br from-forest-400 to-forest-600" },
                { label: "Completeness", value: `${MOCK_RESULTS.gapScore}%`, icon: ShieldCheck, iconBg: "bg-gradient-to-br from-teal-400 to-teal-600" },
                { label: "Ambiguities", value: MOCK_RESULTS.ambiguities, icon: AlertTriangle, iconBg: "bg-gradient-to-br from-gold-400 to-gold-600" },
              ].map((kpi) => {
                const KpiIcon = kpi.icon;
                return (
                  <motion.div key={kpi.label} variants={scaleIn} className="card-parchment flex items-center gap-5 px-5 py-5">
                    <div className={`w-12 h-12 rounded-2xl ${kpi.iconBg} flex items-center justify-center shrink-0`}>
                      <KpiIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-gray-400">{kpi.label}</div>
                      <div className="num-display text-[28px] text-gray-900 leading-none mt-1">{kpi.value}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Estimates + Warning */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="card-parchment px-5 py-4">
                <div className="label-caps mb-1">Estimated Budget</div>
                <div className="num-display text-[20px] text-gray-900">{MOCK_RESULTS.estimatedBudget}</div>
              </div>
              <div className="card-parchment px-5 py-4">
                <div className="label-caps mb-1">Estimated Duration</div>
                <div className="num-display text-[20px] text-gray-900">{MOCK_RESULTS.estimatedDuration}</div>
              </div>
              <div className="rounded-2xl bg-gold-50 px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-gold-600" />
                  <span className="text-[12px] font-semibold text-gold-700">{MOCK_RESULTS.ambiguities} ambiguities flagged</span>
                </div>
                <p className="text-[11px] text-gold-600 leading-relaxed">Review these in the parsed SOW before decomposition.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button onClick={handleReset}
                className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                <RotateCcw className="w-3 h-3" /> Upload Another
              </button>
              <Link href="/enterprise/sow/sow-003">
                <button className="flex items-center gap-2 text-[13px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 px-6 py-2.5 rounded-xl transition-all">
                  View Parsed SOW <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
