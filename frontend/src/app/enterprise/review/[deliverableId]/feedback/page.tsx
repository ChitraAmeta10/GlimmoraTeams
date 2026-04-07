"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Tag,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Send,
  ChevronRight,
  ThumbsUp,
  AlertTriangle,
  Sparkles,
  Shield,
  MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { Badge, Button, Textarea } from "@/components/ui";
import { mockDeliverables } from "@/mocks/data/enterprise-projects";

const feedbackCategories = [
  { label: "Code Quality", color: "bg-forest-100 text-forest-700 border-forest-200" },
  { label: "Testing", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { label: "Documentation", color: "bg-gold-100 text-gold-700 border-gold-200" },
  { label: "Architecture", color: "bg-brown-100 text-brown-700 border-brown-200" },
  { label: "Performance", color: "bg-beige-200 text-beige-800 border-beige-300" },
];

/* Star Rating Component */
function StarRating({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  description: string;
}) {
  const [hovered, setHovered] = React.useState(0);

  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-beige-100/60 last:border-b-0">
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-brown-800">{label}</p>
        <p className="text-[11px] text-beige-500 mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "w-5 h-5 transition-colors",
                star <= (hovered || value)
                  ? "fill-gold-400 text-gold-400"
                  : "fill-none text-beige-300"
              )}
            />
          </button>
        ))}
        <span className="ml-2 text-[12px] font-bold text-brown-700 w-4 text-center">
          {value || "-"}
        </span>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const params = useParams();
  const deliverableId = params.deliverableId as string;

  const deliverable =
    mockDeliverables.find((d) => d.id === deliverableId) ?? mockDeliverables[0];

  const [quality, setQuality] = React.useState(0);
  const [completeness, setCompleteness] = React.useState(0);
  const [documentation, setDocumentation] = React.useState(0);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [decision, setDecision] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState("");
  const [wentWell, setWentWell] = React.useState("");
  const [improvements, setImprovements] = React.useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const avgScore = quality && completeness && documentation
    ? ((quality + completeness + documentation) / 3).toFixed(1)
    : "--";

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Breadcrumb */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm">
        <Link
          href={`/enterprise/review/${deliverableId}`}
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Review Detail
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-beige-400" />
        <span className="text-beige-500">Structured Feedback</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-forest-500 flex items-center justify-center shadow-md shadow-teal-500/20">
            <MessageSquareText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brown-900 tracking-tight font-heading">
              Structured Feedback
            </h1>
            <p className="text-sm text-beige-600">
              {deliverable.title}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form content — two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Rating Section */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gold-500" />
                <h2 className="text-sm font-semibold text-brown-800">
                  Quality Ratings
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-beige-500">Average</span>
                <span className="text-lg font-bold text-brown-900">{avgScore}</span>
                <span className="text-[11px] text-beige-400">/5</span>
              </div>
            </div>

            <StarRating
              label="Quality"
              description="Code/work quality, adherence to standards"
              value={quality}
              onChange={setQuality}
            />
            <StarRating
              label="Completeness"
              description="All requirements met, nothing missing"
              value={completeness}
              onChange={setCompleteness}
            />
            <StarRating
              label="Documentation"
              description="Clear documentation and evidence provided"
              value={documentation}
              onChange={setDocumentation}
            />
          </motion.div>

          {/* Category Tags */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-teal-500" />
              <h2 className="text-sm font-semibold text-brown-800">
                Feedback Categories
              </h2>
            </div>
            <p className="text-[12px] text-beige-500 mb-3">
              Select all categories that apply to your feedback.
            </p>
            <div className="flex flex-wrap gap-2">
              {feedbackCategories.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => toggleTag(cat.label)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all",
                    selectedTags.includes(cat.label)
                      ? cn(cat.color, "shadow-sm")
                      : "bg-white/50 text-beige-500 border-beige-200/60 hover:border-beige-300"
                  )}
                >
                  {selectedTags.includes(cat.label) && (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* General Feedback */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-brown-500" />
              <h2 className="text-sm font-semibold text-brown-800">
                General Feedback
              </h2>
            </div>
            <Textarea
              placeholder="Write your overall feedback about this deliverable..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px]"
            />
          </motion.div>

          {/* Specific Line Items */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* What went well */}
            <div className="rounded-2xl border border-forest-200/40 bg-gradient-to-br from-white/70 to-forest-50/30 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-forest-100 flex items-center justify-center">
                  <ThumbsUp className="w-3.5 h-3.5 text-forest-600" />
                </div>
                <h3 className="text-[13px] font-semibold text-forest-800">
                  What went well
                </h3>
              </div>
              <Textarea
                placeholder="Highlight strengths, good practices, and positive aspects..."
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
                className="min-h-[100px] border-forest-200/50 focus:border-forest-400 focus:ring-forest-500/20"
              />
            </div>

            {/* Areas for improvement */}
            <div className="rounded-2xl border border-gold-200/40 bg-gradient-to-br from-white/70 to-gold-50/30 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gold-100 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-gold-600" />
                </div>
                <h3 className="text-[13px] font-semibold text-gold-800">
                  Areas for improvement
                </h3>
              </div>
              <Textarea
                placeholder="Note areas that need improvement, suggestions, and action items..."
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                className="min-h-[100px] border-gold-200/50 focus:border-gold-400 focus:ring-gold-500/20"
              />
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3) — Decision + Summary */}
        <motion.div variants={fadeUp} className="space-y-5">
          {/* Decision */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-brown-500" />
              <h2 className="text-sm font-semibold text-brown-800">Decision</h2>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  value: "approve",
                  label: "Approve",
                  desc: "Accept this deliverable as complete",
                  icon: CheckCircle2,
                  selected: "border-forest-400 bg-forest-50/50",
                  iconColor: "text-forest-600",
                },
                {
                  value: "rework",
                  label: "Request Rework",
                  desc: "Send back for corrections",
                  icon: RotateCcw,
                  selected: "border-gold-400 bg-gold-50/50",
                  iconColor: "text-gold-600",
                },
                {
                  value: "reject",
                  label: "Reject",
                  desc: "Reject this deliverable entirely",
                  icon: XCircle,
                  selected: "border-[var(--danger)] bg-[var(--danger-light)]",
                  iconColor: "text-[var(--danger)]",
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDecision(opt.value)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left",
                    decision === opt.value
                      ? opt.selected
                      : "border-beige-200/60 bg-white/40 hover:border-beige-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                      decision === opt.value
                        ? "border-current"
                        : "border-beige-300"
                    )}
                  >
                    {decision === opt.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-current" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <opt.icon
                        className={cn(
                          "w-3.5 h-3.5",
                          decision === opt.value
                            ? opt.iconColor
                            : "text-beige-400"
                        )}
                      />
                      <span
                        className={cn(
                          "text-[13px] font-semibold",
                          decision === opt.value
                            ? "text-brown-900"
                            : "text-brown-700"
                        )}
                      >
                        {opt.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-beige-500 mt-0.5">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-beige-200/50 bg-gradient-to-br from-white/80 to-brown-50/30 backdrop-blur-sm p-5">
            <h3 className="text-[13px] font-semibold text-brown-800 mb-3">
              Feedback Summary
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-beige-500">Quality</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "w-3 h-3",
                        s <= quality
                          ? "fill-gold-400 text-gold-400"
                          : "fill-none text-beige-200"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-beige-500">Completeness</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "w-3 h-3",
                        s <= completeness
                          ? "fill-gold-400 text-gold-400"
                          : "fill-none text-beige-200"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-beige-500">Documentation</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "w-3 h-3",
                        s <= documentation
                          ? "fill-gold-400 text-gold-400"
                          : "fill-none text-beige-200"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="h-px bg-beige-200/60 my-2" />
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-beige-500">Categories</span>
                <span className="font-medium text-brown-800">
                  {selectedTags.length || "--"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-beige-500">Decision</span>
                <span className="font-medium text-brown-800 capitalize">
                  {decision || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            variant="gradient-primary"
            size="lg"
            className="w-full justify-center"
          >
            <Send className="w-4 h-4" />
            Submit Feedback
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
