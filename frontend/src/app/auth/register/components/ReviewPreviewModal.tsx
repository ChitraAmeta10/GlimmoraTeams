"use client";

import { Fragment } from "react";
import { X, CheckCircle, Pencil } from "lucide-react";
import type { ContributorType } from "../types";

interface Props {
  onClose: () => void;
  onEditStep: (step: number) => void;
  firstName: string;
  lastName: string;
  email: string;
  contribType: ContributorType;
  dob: string;
  country: string;
  phone: string;
  verificationEmail: string;
  timezone: string;
  departmentCategory: string;
  departmentOther: string;
  degree: string;
  branch: string;
  availability: string;
  linkedin: string;
  primarySkills: string[];
  secondarySkills: string[];
  otherSkills: string[];
  yearsExperience: string;
  careerStage: string;
  workStart: string;
  workEnd: string;
}

function PreviewSection({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (s: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-beige-400 uppercase tracking-widest">{title}</p>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function DataGrid({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
      {rows.map(([key, val]) =>
        val ? (
          <Fragment key={key}>
            <span className="text-beige-500">{key}</span>
            <span className="text-brown-800 font-medium">{val}</span>
          </Fragment>
        ) : null
      )}
    </div>
  );
}

function SkillsList({ title, skills, color }: { title: string; skills: string[]; color: string }) {
  if (!skills.length) return null;
  return (
    <div className="mt-3">
      <p className="text-[10px] text-beige-400 uppercase tracking-wider mb-1.5">{title}</p>
      <div className="flex flex-wrap gap-1">
        {skills.map(skill => (
          <span key={skill} className={`px-2 py-0.5 rounded-md border text-xs font-medium ${color}`}>{skill}</span>
        ))}
      </div>
    </div>
  );
}

export function ReviewPreviewModal({
  onClose, onEditStep,
  firstName, lastName, email, contribType, dob, country,
  phone, verificationEmail,
  timezone, departmentCategory, departmentOther, degree, branch,
  availability, linkedin,
  primarySkills, secondarySkills, otherSkills,
  yearsExperience, careerStage, workStart, workEnd,
}: Props) {
  const displayDept =
    departmentCategory === "other"
      ? departmentOther
      : departmentCategory?.replace(/-/g, " ");

  const handleEdit = (step: number) => {
    onEditStep(step);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brown-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-beige-200 flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-beige-100">
          <div>
            <p className="font-heading font-semibold text-brown-950">Registration Preview</p>
            <p className="text-xs text-beige-500 mt-0.5">Review all your answers before submitting</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-beige-100 text-beige-500 hover:text-brown-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-beige-100 flex-1">
          <PreviewSection title="Step 1 - Identity" step={1} onEdit={handleEdit}>
            <DataGrid rows={[
              ["Full Name", `${firstName} ${lastName}`],
              ["Email", email],
              ["Contributor Type", contribType?.replace(/_/g, " ")],
              ["Country", country],
            ]} />
          </PreviewSection>

          <PreviewSection title="Step 2 - Profile" step={2} onEdit={handleEdit}>
            <DataGrid rows={[
              ["Date of Birth", dob],
              ["Time Zone", timezone],
              ["Department", displayDept],
              ["Availability", availability ? `${availability} hrs / week` : ""],
              ...(degree ? [["Degree", degree + (branch ? ` - ${branch}` : "")] as [string, string]] : []),
              ...(linkedin ? [["LinkedIn", linkedin] as [string, string]] : []),
              ...(yearsExperience ? [["Experience", `${yearsExperience} years`] as [string, string]] : []),
              ...(careerStage ? [["Career Stage", careerStage.replace(/-/g, " ")] as [string, string]] : []),
              ...((workStart || workEnd) ? [["Work Hours", `${workStart} - ${workEnd}`] as [string, string]] : []),
            ]} />
            <SkillsList title="Primary Skills" skills={primarySkills} color="bg-teal-100 border-teal-200 text-teal-800" />
            <SkillsList title="Secondary Skills" skills={secondarySkills} color="bg-forest-100 border-forest-200 text-forest-800" />
            <SkillsList title="Other Skills" skills={otherSkills} color="bg-beige-100 border-beige-200 text-brown-700" />
          </PreviewSection>

          <PreviewSection title="Step 3 - Verification" step={3} onEdit={handleEdit}>
            <DataGrid rows={[
              ["Phone", (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-teal-500 shrink-0" /> {phone}
                </span>
              )],
              ["Email OTP", (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-teal-500 shrink-0" /> {verificationEmail}
                </span>
              )],
            ]} />
          </PreviewSection>
        </div>

        <div className="sticky bottom-0 px-5 py-4 bg-white border-t border-beige-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-brown-600 hover:bg-brown-700 text-white text-sm font-semibold transition-colors"
          >
            Looks good - Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
