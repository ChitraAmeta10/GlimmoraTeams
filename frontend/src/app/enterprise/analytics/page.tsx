"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Gauge,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Activity,
  TrendingUp,
  Shield,
  DollarSign,
  FileText,
  Download,
  Filter,
  Heart,
  GraduationCap,
  Globe2,
} from "lucide-react";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { toast } from "@/lib/stores/toast-store";

/* ══════════════════════════════════════════
   WORKFORCE DASHBOARD — SOW 3.1.6, 19.4, 27.3
   ══════════════════════════════════════════ */

const segmentOptions = ["All Segments", "Students", "Women Workforce", "Freelancers", "Internal"];
const regionOptions = ["All Regions", "South Asia", "Southeast Asia", "Middle East", "Africa", "Global"];
const dateRangeOptions = ["Last 7 days", "Last 30 days", "This Quarter", "This Year"];

/* ── KPIs ── */
const kpis = [
  { label: "Active Contributors", value: "47", change: "+8", positive: true, icon: Users, gradient: 'linear-gradient(135deg, rgba(166,119,99,0.14), rgba(166,119,99,0.06))', border: 'rgba(166,119,99,0.20)', iconColor: '#A67763', barGradient: 'linear-gradient(90deg, #A67763, #C49A88)' },
  { label: "Engagement Level", value: "74%", change: "+3.8%", positive: true, icon: Heart, gradient: 'linear-gradient(135deg, rgba(91,155,162,0.14), rgba(91,155,162,0.06))', border: 'rgba(91,155,162,0.20)', iconColor: '#2A6068', barGradient: 'linear-gradient(90deg, #5B9BA2, #8FC0C7)' },
  { label: "Skills Coverage", value: "86%", change: "+5.1%", positive: true, icon: Layers, gradient: 'linear-gradient(135deg, rgba(77,87,65,0.14), rgba(77,87,65,0.06))', border: 'rgba(77,87,65,0.20)', iconColor: '#4D5741', barGradient: 'linear-gradient(90deg, #4D5741, #949A8D)' },
  { label: "Capacity Utilization", value: "82%", change: "-1.3%", positive: false, icon: Gauge, gradient: 'linear-gradient(135deg, rgba(208,176,96,0.14), rgba(208,176,96,0.06))', border: 'rgba(208,176,96,0.20)', iconColor: '#7A5020', barGradient: 'linear-gradient(90deg, #D0B060, #E0CC8A)' },
];

/* ── Secondary metrics (SOW 27.3) ── */
const secondaryMetrics = [
  { label: "Skill Development Progress", value: "68%", description: "Contributors advancing proficiency this quarter", icon: GraduationCap, iconColor: '#2A6068', gradient: 'linear-gradient(135deg, rgba(91,155,162,0.14), rgba(91,155,162,0.06))', border: 'rgba(91,155,162,0.20)' },
  { label: "Diversity Index", value: "0.82", description: "Shannon diversity across segments and geography", icon: Globe2, iconColor: '#4D5741', gradient: 'linear-gradient(135deg, rgba(77,87,65,0.14), rgba(77,87,65,0.06))', border: 'rgba(77,87,65,0.20)' },
  { label: "Inclusion Participation", value: "91%", description: "Women & student contributors actively engaged", icon: Heart, iconColor: '#A67763', gradient: 'linear-gradient(135deg, rgba(166,119,99,0.14), rgba(166,119,99,0.06))', border: 'rgba(166,119,99,0.20)' },
];

/* ── Skills heatmap ── */
const skillHeatmapData = [
  { skill: "React / Next.js", demand: 92, availability: 88, gap: 4, proficiency: { beginner: 8, intermediate: 42, advanced: 50 } },
  { skill: "Node.js / NestJS", demand: 85, availability: 78, gap: 7, proficiency: { beginner: 15, intermediate: 45, advanced: 40 } },
  { skill: "PostgreSQL", demand: 78, availability: 82, gap: -4, proficiency: { beginner: 12, intermediate: 48, advanced: 40 } },
  { skill: "TypeScript", demand: 95, availability: 91, gap: 4, proficiency: { beginner: 5, intermediate: 35, advanced: 60 } },
  { skill: "DevOps / CI-CD", demand: 68, availability: 55, gap: 13, proficiency: { beginner: 25, intermediate: 45, advanced: 30 } },
  { skill: "Security / Auth", demand: 62, availability: 48, gap: 14, proficiency: { beginner: 30, intermediate: 40, advanced: 30 } },
  { skill: "Mobile / RN", demand: 54, availability: 60, gap: -6, proficiency: { beginner: 18, intermediate: 47, advanced: 35 } },
  { skill: "QA / Testing", demand: 72, availability: 65, gap: 7, proficiency: { beginner: 20, intermediate: 50, advanced: 30 } },
  { skill: "UI / UX Design", demand: 58, availability: 52, gap: 6, proficiency: { beginner: 22, intermediate: 43, advanced: 35 } },
  { skill: "Data / Analytics", demand: 45, availability: 38, gap: 7, proficiency: { beginner: 28, intermediate: 42, advanced: 30 } },
  { skill: "Finance Domain", demand: 40, availability: 35, gap: 5, proficiency: { beginner: 35, intermediate: 40, advanced: 25 } },
  { skill: "HR Domain", demand: 32, availability: 30, gap: 2, proficiency: { beginner: 32, intermediate: 43, advanced: 25 } },
];

const capacityData = [
  { label: "Full-Time", utilized: 28, total: 32, gradient: 'linear-gradient(90deg, #4D5741, #949A8D)' },
  { label: "Part-Time", utilized: 12, total: 15, gradient: 'linear-gradient(90deg, #5B9BA2, #8FC0C7)' },
  { label: "Limited", utilized: 5, total: 8, gradient: 'linear-gradient(90deg, #D0B060, #E0CC8A)' },
];

const performanceMetrics = [
  { label: "Acceptance Rate", value: 92, suffix: "%", trend: "+3.5%", trendPositive: true, gradient: 'linear-gradient(90deg, #4D5741, #949A8D)' },
  { label: "Avg Rating", value: 4.7, suffix: "/5", trend: "+0.2", trendPositive: true, gradient: 'linear-gradient(90deg, #D0B060, #E0CC8A)' },
  { label: "Rework Rate", value: 12, suffix: "%", trend: "-3.2%", trendPositive: true, gradient: 'linear-gradient(90deg, #A67763, #C49A88)' },
  { label: "On-Time Delivery", value: 87, suffix: "%", trend: "+4.2%", trendPositive: true, gradient: 'linear-gradient(90deg, #5B9BA2, #8FC0C7)' },
];

/* ── Nav cards data ── */
const navCards = [
  { href: "/enterprise/analytics/economic", icon: DollarSign, title: "Economic Dashboard", description: "Budget vs actual, cost trends, and forecasts.", gradient: 'linear-gradient(135deg, rgba(208,176,96,0.14), rgba(208,176,96,0.06))', border: 'rgba(208,176,96,0.20)', iconColor: '#7A5020' },
  { href: "/enterprise/analytics/governance", icon: Shield, title: "Governance & Risk", description: "Incidents, fraud flags, and APG overrides.", gradient: 'linear-gradient(135deg, rgba(91,155,162,0.14), rgba(91,155,162,0.06))', border: 'rgba(91,155,162,0.20)', iconColor: '#2A6068' },
  { href: "/enterprise/analytics/reports", icon: FileText, title: "Self-service Analytics", description: "Build custom reports with drill-down and export.", gradient: 'linear-gradient(135deg, rgba(166,119,99,0.14), rgba(166,119,99,0.06))', border: 'rgba(166,119,99,0.20)', iconColor: '#A67763' },
  { href: "/enterprise/audit", icon: Activity, title: "Audit Log", description: "Complete timeline of all actions and events.", gradient: 'linear-gradient(135deg, rgba(77,87,65,0.14), rgba(77,87,65,0.06))', border: 'rgba(77,87,65,0.20)', iconColor: '#4D5741' },
];

/* ── Heatmap bar color by value ── */
function heatOpacity(value: number): number {
  if (value >= 90) return 0.85;
  if (value >= 75) return 0.65;
  if (value >= 60) return 0.5;
  if (value >= 40) return 0.35;
  return 0.2;
}

/* ══════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════ */
export default function WorkforceDashboardPage() {
  const [segment, setSegment] = React.useState("All Segments");
  const [region, setRegion] = React.useState("All Regions");
  const [dateRange, setDateRange] = React.useState("This Quarter");

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ── Page Header ── */}
      <motion.div variants={fadeUp} className="relative" style={{ marginBottom: 24 }}>
        <div className="absolute pointer-events-none" style={{
          top: -60, left: -80, width: 500, height: 300,
          background: 'radial-gradient(ellipse at 20% 40%, rgba(208,176,96,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(91,155,162,0.06) 0%, transparent 45%)',
          filter: 'blur(40px)',
        }} />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading leading-[1.15]" style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              Workforce Dashboard
            </h1>
            <p style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-muted)', fontWeight: 400, lineHeight: 1.55 }}>
              Skills heatmap, contributor capacity, and performance overview across all active projects.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toast.info("CSV export would be generated for the current workforce view.")}
              className="flex items-center gap-1.5 rounded-lg transition-all duration-200"
              style={{ padding: '6px 12px', fontSize: 11, fontWeight: 500, cursor: 'pointer', background: 'transparent', color: 'var(--ink-muted)', border: '1px solid var(--border-soft)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(166,119,99,0.25)'; e.currentTarget.style.background = 'rgba(166,119,99,0.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Download style={{ width: 12, height: 12 }} /> CSV
            </button>
            <button
              onClick={() => toast.info("PDF report would be generated for the current workforce view.")}
              className="flex items-center gap-1.5 rounded-lg transition-all duration-200"
              style={{
                padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: 'linear-gradient(135deg, #A67763, #886151)', color: '#FFFFFF',
                border: '1px solid rgba(166,119,99,0.30)',
                boxShadow: '0 1px 4px rgba(166,119,99,0.18), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 3px 10px rgba(166,119,99,0.28), inset 0 1px 0 rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(166,119,99,0.18), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = ''; }}
            >
              <Download style={{ width: 12, height: 12 }} /> PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Filter Bar ── */}
      <motion.div variants={fadeUp} className="card-parchment" style={{ padding: '10px 16px', marginBottom: 20 }}>
        <div className="flex flex-wrap items-center gap-3">
          <Filter style={{ width: 13, height: 13, color: 'var(--ink-faint)' }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filters</span>

          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            style={{
              height: 28, borderRadius: 6, padding: '0 10px', fontSize: 11, fontWeight: 500, cursor: 'pointer',
              background: 'rgba(255,255,255,0.8)', color: 'var(--ink-mid)',
              border: '1px solid var(--border-soft)', outline: 'none',
            }}
          >
            {segmentOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              height: 28, borderRadius: 6, padding: '0 10px', fontSize: 11, fontWeight: 500, cursor: 'pointer',
              background: 'rgba(255,255,255,0.8)', color: 'var(--ink-mid)',
              border: '1px solid var(--border-soft)', outline: 'none',
            }}
          >
            {regionOptions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          <div className="flex items-center gap-1 ml-auto">
            {dateRangeOptions.map((dr) => (
              <button
                key={dr}
                onClick={() => setDateRange(dr)}
                className="rounded-md transition-all duration-200"
                style={{
                  padding: '4px 10px', fontSize: 10, fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: dateRange === dr ? 'linear-gradient(135deg, #A67763, #886151)' : 'transparent',
                  color: dateRange === dr ? '#FFFFFF' : 'var(--ink-faint)',
                }}
                onMouseEnter={(e) => { if (dateRange !== dr) { e.currentTarget.style.background = 'rgba(166,119,99,0.06)'; e.currentTarget.style.color = 'var(--ink-mid)'; } }}
                onMouseLeave={(e) => { if (dateRange !== dr) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-faint)'; } }}
              >
                {dr}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: 20 }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} variants={fadeUp} className="card-parchment" style={{ padding: '20px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                <div
                  className="flex items-center justify-center"
                  style={{ width: 34, height: 34, borderRadius: 9, background: kpi.gradient, border: `1px solid ${kpi.border}` }}
                >
                  <Icon style={{ width: 15, height: 15, color: kpi.iconColor }} />
                </div>
                <div className="flex items-center gap-1">
                  {kpi.positive
                    ? <ArrowUpRight style={{ width: 11, height: 11, color: '#4D5741' }} />
                    : <ArrowDownRight style={{ width: 11, height: 11, color: '#7A5020' }} />
                  }
                  <span style={{ fontSize: 10, fontWeight: 600, color: kpi.positive ? '#344028' : '#7A5020' }}>{kpi.change}</span>
                </div>
              </div>
              <p className="num-display" style={{ fontSize: 28 }}>{kpi.value}</p>
              <p style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 3, fontWeight: 500 }}>{kpi.label}</p>
              <div className="prog-track" style={{ marginTop: 12, height: 3 }}>
                <div className="prog-fill" style={{ width: '100%', background: kpi.barGradient, height: 3 }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Secondary Metrics (SOW 27.3) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: 20 }}>
        {secondaryMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <motion.div key={m.label} variants={fadeUp} className="card-parchment" style={{ padding: '16px 18px' }}>
              <div className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 32, height: 32, borderRadius: 9, background: m.gradient, border: `1px solid ${m.border}` }}
                >
                  <Icon style={{ width: 14, height: 14, color: m.iconColor }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="num-display" style={{ fontSize: 20 }}>{m.value}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)' }}>{m.label}</span>
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2, lineHeight: 1.4 }}>{m.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Skills Heatmap ── */}
      <motion.div variants={fadeUp} className="card-parchment" style={{ padding: '24px', marginBottom: 20 }}>
        <div className="section-header-parchment" style={{ marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>Skills Heatmap</h2>
            <p style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2 }}>Demand vs availability with proficiency distribution</p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: 'High (90+)', opacity: 0.85 },
              { label: 'Mid (60-89)', opacity: 0.5 },
              { label: 'Low (<40)', opacity: 0.2 },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div style={{ width: 12, height: 9, borderRadius: 2, background: '#A67763', opacity: l.opacity }} />
                <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Header row */}
        <div className="grid grid-cols-[150px_1fr_1fr_70px_minmax(140px,1fr)]" style={{ gap: 8, padding: '0 8px 8px', borderBottom: '1px solid var(--border-hair)' }}>
          {['Skill', 'Demand', 'Availability', 'Gap', 'Proficiency'].map((h) => (
            <span key={h} className="label-caps" style={{ fontSize: 9, textAlign: h === 'Skill' ? 'left' : 'center' }}>{h}</span>
          ))}
        </div>

        {/* Data rows */}
        <div>
          {skillHeatmapData.map((row) => (
            <div
              key={row.skill}
              className="grid grid-cols-[150px_1fr_1fr_70px_minmax(140px,1fr)] items-center transition-all duration-150"
              style={{
                gap: 8, padding: '7px 8px',
                borderBottom: '1px solid var(--border-hair)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(166,119,99,0.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-mid)' }}>{row.skill}</span>

              {/* Demand bar */}
              <div className="flex items-center gap-2">
                <div className="prog-track flex-1" style={{ height: 22, position: 'relative' }}>
                  <div className="prog-fill" style={{ width: `${row.demand}%`, background: '#A67763', opacity: heatOpacity(row.demand), height: 22, borderRadius: 4 }} />
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--ink-mid)' }}>{row.demand}%</span>
                </div>
              </div>

              {/* Availability bar */}
              <div className="flex items-center gap-2">
                <div className="prog-track flex-1" style={{ height: 22, position: 'relative' }}>
                  <div className="prog-fill" style={{ width: `${row.availability}%`, background: '#A67763', opacity: heatOpacity(row.availability) * 0.75, height: 22, borderRadius: 4 }} />
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--ink-mid)' }}>{row.availability}%</span>
                </div>
              </div>

              {/* Gap */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span className="badge-parchment" style={{
                  fontSize: 10, fontWeight: 700,
                  background: row.gap > 10 ? 'rgba(208,176,96,0.10)' : row.gap > 0 ? 'rgba(166,119,99,0.06)' : 'rgba(77,87,65,0.08)',
                  color: row.gap > 10 ? '#7A5020' : row.gap > 0 ? 'var(--ink-mid)' : '#344028',
                  border: `1px solid ${row.gap > 10 ? 'rgba(208,176,96,0.22)' : row.gap > 0 ? 'var(--border-soft)' : 'rgba(77,87,65,0.18)'}`,
                }}>
                  {row.gap > 0 ? `+${row.gap}` : `${row.gap}`}
                </span>
              </div>

              {/* Proficiency distribution */}
              <div className="flex items-center gap-1.5">
                <div style={{ flex: 1, height: 18, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${row.proficiency.beginner}%`, height: '100%', background: '#C9B09D', opacity: 0.5 }} title={`Beginner: ${row.proficiency.beginner}%`} />
                  <div style={{ width: `${row.proficiency.intermediate}%`, height: '100%', background: '#A67763', opacity: 0.5 }} title={`Intermediate: ${row.proficiency.intermediate}%`} />
                  <div style={{ width: `${row.proficiency.advanced}%`, height: '100%', background: '#A67763', opacity: 0.85 }} title={`Advanced: ${row.proficiency.advanced}%`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proficiency legend */}
        <div className="flex items-center gap-4 justify-end" style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-hair)' }}>
          {[
            { label: 'Beginner', color: '#C9B09D', opacity: 0.5 },
            { label: 'Intermediate', color: '#A67763', opacity: 0.5 },
            { label: 'Advanced', color: '#A67763', opacity: 0.85 },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div style={{ width: 12, height: 9, borderRadius: 2, background: l.color, opacity: l.opacity }} />
              <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Capacity + Performance Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ marginBottom: 20 }}>

        {/* Contributor Capacity */}
        <motion.div variants={fadeUp} className="card-parchment" style={{ padding: '24px' }}>
          <div className="section-header-parchment" style={{ marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>Contributor Capacity</h3>
              <p style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2 }}>Utilized vs total by availability tier</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {capacityData.map((seg) => {
              const pct = Math.round((seg.utilized / seg.total) * 100);
              return (
                <div key={seg.label}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-mid)' }}>{seg.label}</span>
                    <span className="num-display" style={{ fontSize: 13 }}>{seg.utilized} / {seg.total}</span>
                  </div>
                  <div className="prog-track" style={{ height: 24, position: 'relative' }}>
                    <div className="prog-fill" style={{ width: `${pct}%`, background: seg.gradient, height: 24, borderRadius: 4 }} />
                    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 10, fontWeight: 700, color: '#FFFFFF' }}>{pct}% utilized</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between" style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-hair)' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>Total capacity</span>
            <span className="num-display" style={{ fontSize: 14 }}>45 / 55 assigned</span>
          </div>
        </motion.div>

        {/* Performance Overview */}
        <motion.div variants={fadeUp} className="card-parchment" style={{ padding: '24px' }}>
          <div className="section-header-parchment" style={{ marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>Performance Overview</h3>
              <p style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2 }}>Key quality and delivery metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {performanceMetrics.map((pm) => (
              <div
                key={pm.label}
                className="rounded-lg"
                style={{ padding: '16px 14px', textAlign: 'center', background: 'rgba(166,119,99,0.02)', border: '1px solid var(--border-hair)' }}
              >
                <p className="num-display" style={{ fontSize: 26 }}>{pm.value}<span style={{ fontSize: 13, color: 'var(--ink-faint)', fontWeight: 400 }}>{pm.suffix}</span></p>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', marginTop: 4 }}>{pm.label}</p>
                <div className="prog-track" style={{ marginTop: 10, height: 3 }}>
                  <div className="prog-fill" style={{ width: pm.label === 'Rework Rate' ? `${pm.value}%` : `${pm.value}%`, background: pm.gradient, height: 3 }} />
                </div>
                <div className="flex items-center justify-center gap-1" style={{ marginTop: 8 }}>
                  {pm.trendPositive
                    ? <ArrowUpRight style={{ width: 10, height: 10, color: '#4D5741' }} />
                    : <ArrowDownRight style={{ width: 10, height: 10, color: '#7A5020' }} />
                  }
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#344028' }}>{pm.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Explore Analytics ── */}
      <motion.div variants={fadeUp}>
        <div className="section-header-parchment" style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>Explore Analytics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {navCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href} className="block group">
                <div
                  className="card-parchment transition-all duration-200"
                  style={{ padding: '20px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(77,55,46,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                    <div
                      className="flex items-center justify-center"
                      style={{ width: 36, height: 36, borderRadius: 10, background: card.gradient, border: `1px solid ${card.border}` }}
                    >
                      <Icon style={{ width: 16, height: 16, color: card.iconColor }} />
                    </div>
                    <ChevronRight style={{ width: 14, height: 14, color: 'var(--ink-faint)' }} />
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{card.title}</h3>
                  <p style={{ fontSize: 11, color: 'var(--ink-faint)', lineHeight: 1.4 }}>{card.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

    </motion.div>
  );
}
