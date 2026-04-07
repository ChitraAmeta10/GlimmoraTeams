"use client";

import {
  Users,
  TrendingUp,
  Activity,
  Shield,
  ArrowUpRight,
  Gauge,
  DollarSign,
  BarChart3,
} from "lucide-react";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardContent,
  StatCard,
  Badge,
  Button,
  Progress,
} from "@/components/ui";

export default function AnalyticsOverviewPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brown-950">
            Analytics Overview
          </h1>
          <p className="text-sm text-beige-600 mt-1">
            Platform-wide intelligence across workforce, economics, and operations.
          </p>
        </div>
        <Button variant="gradient-cta" size="md">
          <BarChart3 className="w-4 h-4" />
          Build Report
        </Button>
      </div>

      {/* Top-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="gradient-brown"
          label="Total Contributors"
          value="1,247"
          change="+89 this month"
          changeType="positive"
          icon={<Users className="w-5 h-5 text-white/80" />}
        />
        <StatCard
          variant="gradient-forest"
          label="Task Completion"
          value="94.7%"
          change="+2.3%"
          changeType="positive"
          subtitle="30-day avg"
          icon={<Activity className="w-5 h-5 text-white/80" />}
        />
        <StatCard
          variant="gradient-teal"
          label="Revenue (MTD)"
          value="$287K"
          change="+14%"
          changeType="positive"
          subtitle="vs target"
          icon={<DollarSign className="w-5 h-5 text-white/80" />}
        />
        <StatCard
          variant="gradient-gold"
          label="SLA Compliance"
          value="97.1%"
          change="-0.4%"
          changeType="negative"
          subtitle="3 breaches"
          icon={<Shield className="w-5 h-5 text-white/80" />}
        />
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workforce Intelligence */}
        <GlassCard hover="lift" className="cursor-pointer group">
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brown-400 to-brown-600 shadow-sm">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <GlassCardTitle>Workforce</GlassCardTitle>
              </div>
              <ArrowUpRight className="w-4 h-4 text-beige-400 group-hover:text-brown-500 transition-colors" />
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">Active Contributors</span>
                <span className="font-semibold text-brown-900">847</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">Avg Utilization</span>
                <span className="font-semibold text-brown-900">73%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">Top Skills Gap</span>
                <Badge variant="gold" size="sm">Cloud / DevOps</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">Diversity Score</span>
                <span className="font-semibold text-forest-700">8.4/10</span>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Economic Performance */}
        <GlassCard hover="lift" className="cursor-pointer group">
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-forest-400 to-teal-500 shadow-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <GlassCardTitle>Economics</GlassCardTitle>
              </div>
              <ArrowUpRight className="w-4 h-4 text-beige-400 group-hover:text-brown-500 transition-colors" />
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">Platform Volume</span>
                <span className="font-semibold text-brown-900">$1.2M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">Avg Cost/Task</span>
                <span className="font-semibold text-brown-900">$347</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">Cost Savings</span>
                <span className="font-semibold text-forest-700">23%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">Earnings Growth</span>
                <Badge variant="forest" size="sm" dot>+18% MoM</Badge>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Governance */}
        <GlassCard hover="lift" className="cursor-pointer group">
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-sm">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <GlassCardTitle>Governance</GlassCardTitle>
              </div>
              <ArrowUpRight className="w-4 h-4 text-beige-400 group-hover:text-brown-500 transition-colors" />
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">SLA Breaches</span>
                <Badge variant="gold" size="sm">3 active</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">Fraud Flags</span>
                <span className="font-semibold text-forest-700">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">APG Overrides</span>
                <span className="font-semibold text-brown-900">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-beige-600">Governance Score</span>
                <span className="font-semibold text-forest-700">96%</span>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Operational Performance snapshot */}
      <GlassCard hover="none">
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <GlassCardTitle>Operational Performance</GlassCardTitle>
            <Button variant="ghost" size="sm">
              View Details <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Task Completion Rate", value: "94.7%", target: "90%", pct: 95 },
              { label: "Avg Time to Assignment", value: "1.2h", target: "< 2h", pct: 85 },
              { label: "Quality Score (Acceptance)", value: "91.3%", target: "85%", pct: 91 },
              { label: "Customer Satisfaction", value: "4.6/5", target: "4.0", pct: 92 },
            ].map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-3">
                  <svg className="w-20 h-20 -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke="#E9DFD7"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${metric.pct * 2.136} 213.6`}
                    />
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4D5741" />
                        <stop offset="100%" stopColor="#5B9BA2" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-sm font-bold text-brown-900">
                    {metric.value}
                  </span>
                </div>
                <p className="text-xs font-semibold text-brown-800">{metric.label}</p>
                <p className="text-[0.6rem] text-beige-500 mt-0.5">Target: {metric.target}</p>
              </div>
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
