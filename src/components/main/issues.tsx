"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/table/data-table";
import { issueColumns, type Issue } from "@/components/table/issue-columns";
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  MessageCircle,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import { StatCard } from "./stat-card";

export const Issues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Mock data for demonstration
  const mockIssues: Issue[] = [
    {
      id: "1",
      issueNumber: 1234,
      repoName: "next.js",
      repoOwner: "vercel",
      title: "Add support for React 19 concurrent features",
      body: "This issue tracks the implementation of React 19 concurrent features...",
      createdAt: new Date("2024-01-15"),
      status: "open",
      priority: "high",
      labels: ["enhancement", "react", "concurrent"],
      assignees: ["tim", "sophie"],
      comments: 15,
      reactions: 8,
    },
    {
      id: "2",
      issueNumber: 5678,
      repoName: "typescript",
      repoOwner: "microsoft",
      title: "Fix type inference for generic constraints",
      body: "The type inference is not working correctly for generic constraints...",
      createdAt: new Date("2024-01-10"),
      status: "open",
      priority: "medium",
      labels: ["bug", "types", "inference"],
      assignees: ["andrew"],
      comments: 8,
      reactions: 3,
    },
    {
      id: "3",
      issueNumber: 9012,
      repoName: "tailwindcss",
      repoOwner: "tailwindlabs",
      title: "Add new color palette for dark mode",
      body: "We need to add a new color palette specifically designed for dark mode...",
      createdAt: new Date("2024-01-08"),
      status: "closed",
      priority: "low",
      labels: ["design", "dark-mode", "colors"],
      assignees: ["adam"],
      comments: 23,
      reactions: 12,
    },
    {
      id: "4",
      issueNumber: 3456,
      repoName: "prisma",
      repoOwner: "prisma",
      title: "Improve query performance for large datasets",
      body: "The query performance needs to be improved for datasets with more than 100k records...",
      createdAt: new Date("2024-01-12"),
      status: "open",
      priority: "urgent",
      labels: ["performance", "database", "optimization"],
      assignees: ["julien", "harshit"],
      comments: 31,
      reactions: 18,
    },
    {
      id: "5",
      issueNumber: 3456,
      repoName: "prisma",
      repoOwner: "prisma",
      title: "Improve query performance for large datasets",
      body: "The query performance needs to be improved for datasets with more than 100k records...",
      createdAt: new Date("2024-01-12"),
      status: "open",
      priority: "urgent",
      labels: ["performance", "database", "optimization"],
      assignees: ["julien", "harshit"],
      comments: 31,
      reactions: 18,
    },
    {
      id: "6",
      issueNumber: 3456,
      repoName: "prisma",
      repoOwner: "prisma",
      title: "Improve query performance for large datasets",
      body: "The query performance needs to be improved for datasets with more than 100k records...",
      createdAt: new Date("2024-01-12"),
      status: "open",
      priority: "urgent",
      labels: ["performance", "database", "optimization"],
      assignees: ["julien", "harshit"],
      comments: 31,
      reactions: 18,
    },
    {
      id: "7",
      issueNumber: 3456,
      repoName: "prisma",
      repoOwner: "prisma",
      title: "Improve query performance for large datasets",
      body: "The query performance needs to be improved for datasets with more than 100k records...",
      createdAt: new Date("2024-01-12"),
      status: "open",
      priority: "urgent",
      labels: ["performance", "database", "optimization"],
      assignees: ["julien", "harshit"],
      comments: 31,
      reactions: 18,
    },
    {
      id: "8",
      issueNumber: 3456,
      repoName: "prisma",
      repoOwner: "prisma",
      title: "Improve query performance for large datasets",
      body: "The query performance needs to be improved for datasets with more than 100k records...",
      createdAt: new Date("2024-01-12"),
      status: "open",
      priority: "urgent",
      labels: ["performance", "database", "optimization"],
      assignees: ["julien", "harshit"],
      comments: 31,
      reactions: 18,
    },
    {
      id: "9",
      issueNumber: 3456,
      repoName: "prisma",
      repoOwner: "prisma",
      title: "Improve query performance for large datasets",
      body: "The query performance needs to be improved for datasets with more than 100k records...",
      createdAt: new Date("2024-01-12"),
      status: "open",
      priority: "urgent",
      labels: ["performance", "database", "optimization"],
      assignees: ["julien", "harshit"],
      comments: 31,
      reactions: 18,
    },
    {
      id: "10",
      issueNumber: 3456,
      repoName: "prisma",
      repoOwner: "prisma",
      title: "Improve query performance for large datasets",
      body: "The query performance needs to be improved for datasets with more than 100k records...",
      createdAt: new Date("2024-01-12"),
      status: "open",
      priority: "urgent",
      labels: ["performance", "database", "optimization"],
      assignees: ["julien", "harshit"],
      comments: 31,
      reactions: 18,
    },
    {
      id: "11",
      issueNumber: 3456,
      repoName: "prisma",
      repoOwner: "prisma",
      title: "Improve query performance for large datasets",
      body: "The query performance needs to be improved for datasets with more than 100k records...",
      createdAt: new Date("2024-01-12"),
      status: "open",
      priority: "urgent",
      labels: ["performance", "database", "optimization"],
      assignees: ["julien", "harshit"],
      comments: 31,
      reactions: 18,
    },
    {
      id: "12",
      issueNumber: 3456,
      repoName: "prisma",
      repoOwner: "prisma",
      title: "Improve query performance for large datasets",
      body: "The query performance needs to be improved for datasets with more than 100k records...",
      createdAt: new Date("2024-01-12"),
      status: "open",
      priority: "urgent",
      labels: ["performance", "database", "optimization"],
      assignees: ["julien", "harshit"],
      comments: 31,
      reactions: 18,
    },
  ];

  const stats = useMemo(
    () => [
      {
        title: "Total Issues",
        Icon: AlertCircle,
        value: issues.length,
        description: "Tracked across all repos",
        color: "text-green-600",
      },
      {
        title: "Open Issues",
        Icon: Clock,
        value: issues.filter((i) => i.status === "open").length,
        description: "Need attention",
        color: "text-yellow-600",
      },
      {
        title: "Closed Issues",
        Icon: CheckCircle,
        value: issues.filter((i) => i.status === "closed").length,
        description: "Resolved",
        color: "text-green-600",
      },
      {
        title: "Urgent Issues",
        Icon: TrendingUp,
        value: issues.filter((i) => i.priority === "urgent").length,
        description: "High priority",
        color: "text-red-600",
      },
    ],
    [issues],
  );

  useEffect(() => {
    setTimeout(() => {
      setIssues(mockIssues);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.repoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.repoOwner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || issue.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || issue.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span> Loading issues...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} color={stat.color} />
        ))}
      </div> */}

      <Card>
        {/* <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Filter and search through your tracked issues
          </CardDescription>
        </CardHeader> */}
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search issues, repos, or owners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issues Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tracked Issues</span>
            <Badge variant="secondary">
              {filteredIssues.length}{" "}
              {filteredIssues.length === 1 ? "issue" : "issues"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Issues from your starred repositories with real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No issues found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ||
                statusFilter !== "all" ||
                priorityFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Start by starring repositories to track their issues"}
              </p>
              <Button variant="outline">
                <GitBranch className="w-4 h-4 mr-2" />
                Browse Repositories
              </Button>
            </div>
          ) : (
            <DataTable columns={issueColumns} data={filteredIssues} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
