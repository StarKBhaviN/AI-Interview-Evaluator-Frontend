"use client";

import { Users, TrendingUp, CheckCircle, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { analyticsData } from "../../../shared/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Router from "next/router";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Candidates",
      value: analyticsData.totalCandidates,
      icon: <Users className="w-6 h-6" />,
      color: "blue",
    },
    {
      label: "Average Score",
      value: `${analyticsData.averageScore}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "green",
    },
    {
      label: "Pass Rate",
      value: `${analyticsData.passRate}%`,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "purple",
    },
    {
      label: "Today's Interviews",
      value: analyticsData.todayInterviews,
      icon: <Calendar className="w-6 h-6" />,
      color: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of interview analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`text-${stat.color}-600 bg-${stat.color}-100 p-3 rounded-lg`}
                >
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => Router.push("/admin/candidates")}>
              View All Candidates
            </Button>
            <Button
              onClick={() => Router.push("/admin/questions")}
              variant="outline"
            >
              Manage Questions
            </Button>
            <Button
              onClick={() => Router.push("/admin/analytics")}
              variant="outline"
            >
              View Analytics
            </Button>
            <Button
              onClick={() => Router.push("/admin/model-performance")}
              variant="outline"
            >
              Model Performance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
