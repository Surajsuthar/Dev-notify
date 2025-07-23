"use client";

import { 
  useState, 
  useMemo,
  useCallback,
  useRef,
} from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getUserIssue } from "../../../module/repo/repo";

export const Issues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [labelFilter, setLabelFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const { data: userIssues, isLoading } = useQuery({
    queryKey: ["userIssues"],
    queryFn: () => getUserIssue(),
  });
  // Mock data for demonstration
  const mockIssues: Issue[] = userIssues?.data?.map((issue) => ({
    ...issue,
    labels: issue.label || [],
    createdAt: new Date(issue.createdAt).toISOString(),
    comments: issue.comments || 0,
    reactions: issue.reactions || 0,
    assignees: issue.assignees || false,
  })) || [];

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
        value: issues.filter((i) => i.state === "open").length,
        description: "Need attention",
        color: "text-yellow-600",
      },
      {
        title: "Closed Issues",
        Icon: CheckCircle,
        value: issues.filter((i) => i.state === "closed").length,
        description: "Resolved",
        color: "text-green-600",
      },
      {
        title: "Urgent Issues",
        Icon: TrendingUp,
        // value: issues.filter((i) => i.state === "urgent").length,
        description: "High priority",
        color: "text-red-600",
      },
    ],
    [issues],
  );

  const labels = useMemo(() => {
    return [...new Set(mockIssues.flatMap((issue) => issue.labels))];
  }, [mockIssues]);

  console.log("labels",mockIssues.map((issue) => issue.labels))

  const filteredIssues = mockIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.owner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || issue.state === statusFilter;

    const matchesLabel =
      labelFilter === "all" || issue.labels.includes(labelFilter);

    const matchesAssignee =
      assigneeFilter === "all" || issue.assignees === (assigneeFilter === "true");

    return matchesSearch && matchesStatus && matchesLabel && matchesAssignee;
  });

  if (isLoading) {
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
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={labelFilter} onValueChange={setLabelFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Labels</SelectItem>
                {labels.map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={(value) => setAssigneeFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Assigned</SelectItem>
                <SelectItem value="false">Unassigned</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setLabelFilter("all");
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
                statusFilter !== "all"
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
