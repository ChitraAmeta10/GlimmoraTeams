"use client";

import {
  ListChecks,
  Wallet,
  Award,
  TrendingUp,
  Clock,
  Star,
  ArrowUpRight,
  Sparkles,
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

export default function ContributorDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-forest-600 p-8 text-white">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-4 right-8 w-24 h-24 rounded-full bg-gold-400/15 blur-xl" />
        <div className="relative z-10">
          <Badge variant="glass" size="sm" className="text-white/80 border-white/20 bg-white/15 mb-3">
            <Sparkles className="w-3 h-3" /> Good afternoon
          </Badge>
          <h1 className="font-heading text-2xl font-semibold mb-1">
            Welcome back, Fatima
          </h1>
          <p className="text-teal-100 text-sm max-w-md">
            You have 3 active tasks and 1 pending review. Your skill genome grew 12% this month.
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="glass"
          label="Active Tasks"
          value="3"
          change="1 due today"
          changeType="neutral"
          icon={<ListChecks className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          variant="glass"
          label="Earnings (MTD)"
          value="$842"
          change="+18%"
          changeType="positive"
          subtitle="vs last month"
          icon={<Wallet className="w-5 h-5 text-forest-600" />}
        />
        <StatCard
          variant="glass"
          label="Credentials"
          value="7"
          change="+2 new"
          changeType="positive"
          icon={<Award className="w-5 h-5 text-gold-600" />}
        />
        <StatCard
          variant="glass"
          label="Skill Score"
          value="78"
          change="+12%"
          changeType="positive"
          subtitle="genome growth"
          icon={<TrendingUp className="w-5 h-5 text-brown-500" />}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <GlassCard className="lg:col-span-2" hover="none">
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <GlassCardTitle>Your Active Tasks</GlassCardTitle>
              <Button variant="ghost" size="sm">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-3">
              {[
                {
                  title: "Frontend Unit Tests — Payment Module",
                  project: "Cloud Migration",
                  deadline: "Today, 6:00 PM",
                  urgent: true,
                  progress: 80,
                  skill: "React Testing",
                },
                {
                  title: "API Documentation — Auth Endpoints",
                  project: "API Gateway",
                  deadline: "Tomorrow",
                  urgent: false,
                  progress: 45,
                  skill: "Technical Writing",
                },
                {
                  title: "Data Validation Scripts",
                  project: "Data Pipeline",
                  deadline: "Mar 9",
                  urgent: false,
                  progress: 20,
                  skill: "Python",
                },
              ].map((task) => (
                <div
                  key={task.title}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-beige-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-brown-900 truncate">
                        {task.title}
                      </p>
                      {task.urgent && (
                        <Badge variant="gold" size="sm" dot>
                          Due Today
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-beige-600">
                      <span>{task.project}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.deadline}
                      </span>
                      <Badge variant="teal" size="sm">{task.skill}</Badge>
                    </div>
                  </div>
                  <div className="w-24 shrink-0">
                    <Progress value={task.progress} size="sm" variant="gradient-forest" />
                    <p className="text-[0.6rem] text-beige-500 mt-1 text-right">{task.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Skill Genome snapshot */}
        <GlassCard hover="none">
          <GlassCardHeader>
            <GlassCardTitle>Skill Genome</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-4">
              {[
                { skill: "React / TypeScript", level: 85, tier: "Advanced" },
                { skill: "Technical Writing", level: 72, tier: "Intermediate" },
                { skill: "Python", level: 60, tier: "Intermediate" },
                { skill: "QA Testing", level: 90, tier: "Advanced" },
                { skill: "CSS / Tailwind", level: 78, tier: "Advanced" },
              ].map((s) => (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-brown-800">{s.skill}</p>
                    <Badge variant={s.tier === "Advanced" ? "forest" : "beige"} size="sm">
                      {s.tier}
                    </Badge>
                  </div>
                  <Progress value={s.level} size="sm" variant="gradient-forest" />
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-5">
              View Full Genome <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Earnings */}
        <GlassCard hover="none">
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <GlassCardTitle>Recent Earnings</GlassCardTitle>
              <Button variant="ghost" size="sm">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-3">
              {[
                { task: "UI Component Library", amount: "$320", date: "Mar 4", status: "Paid" },
                { task: "API Endpoint Tests", amount: "$185", date: "Mar 2", status: "Paid" },
                { task: "Data Entry — Batch 12", amount: "$95", date: "Feb 28", status: "Paid" },
                { task: "Frontend Bug Fixes", amount: "$242", date: "Feb 25", status: "Paid" },
              ].map((earning) => (
                <div
                  key={earning.task}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-beige-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-brown-800">{earning.task}</p>
                    <p className="text-xs text-beige-500 mt-0.5">{earning.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-forest-700">{earning.amount}</p>
                    <Badge variant="forest" size="sm">{earning.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Credentials */}
        <GlassCard hover="none">
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <GlassCardTitle>Latest Credentials</GlassCardTitle>
              <Button variant="ghost" size="sm">
                Wallet <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-3">
              {[
                { name: "React Testing — Advanced", project: "Cloud Migration", date: "Mar 4", icon: Star },
                { name: "API Documentation", project: "API Gateway", date: "Feb 28", icon: Award },
                { name: "Data Pipeline QA", project: "Data Pipeline", date: "Feb 20", icon: Award },
              ].map((cred) => (
                <div
                  key={cred.name}
                  className="flex items-center gap-3 p-3 rounded-xl border border-beige-100 hover:border-gold-200 hover:bg-gold-50/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-sm">
                    <cred.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brown-900 truncate">{cred.name}</p>
                    <p className="text-xs text-beige-500">{cred.project} · {cred.date}</p>
                  </div>
                  <Badge variant="gradient-gold" size="sm">PoDL</Badge>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
}
