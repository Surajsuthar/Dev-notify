"use client";

import { useState, useMemo } from "react";
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
import { DataTable } from "@/components/table/data-table";
import { issueColumns } from "@/components/table/issue-columns";
import {
  Search,
  RefreshCw,
  AlertCircle,
  GitBranch,
  RefreshCcw,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllIssuesFromGithub } from "@/module/repo/repo";
import { IssueDataTableType } from "@/types";
import { useSession } from "next-auth/react";

export const Issues = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [labelFilter, setLabelFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [repoFilter, setRepoFilter] = useState("all");
  const { data: session } = useSession();

  const {
    data: userIssues,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userIssues"],
    queryFn: () => getAllIssuesFromGithub(),
    staleTime: 1000 * 60 * 30,
    enabled: !!session?.user,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const mockIssues = useMemo<IssueDataTableType[]>(() => {
    return (
      userIssues?.data?.map((issue) => ({
        ...issue,
        labels: issue.labels || [],
        createdAt: new Date(issue.createdAt).toISOString(),
        comments: issue.comments || 0,
        reactions: issue.reactions || 0,
        assignees: issue.assigned || false,
      })) || []
    );
  }, [userIssues]);

  const labels = useMemo(() => {
    return [...new Set(mockIssues.flatMap((issue) => issue.labels))].sort();
  }, [mockIssues]);

  const language = useMemo(() => {
    return [...new Set(mockIssues.map((issues) => issues.language))].sort();
  }, [mockIssues]);

  const allRepo = useMemo(() => {
    return [...new Set(mockIssues.map((issues) => issues.owner))].sort();
  }, [mockIssues]);

  const filteredIssues = useMemo(() => {
    return mockIssues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.owner.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || issue.language === statusFilter;

      const matchesLabel =
        labelFilter === "all" || issue.labels?.includes(labelFilter);

      const matchesAssignee =
        assigneeFilter === "all" ||
        issue.assigned === (assigneeFilter === "true");

      const matchRepo = repoFilter === "all" || issue.owner === repoFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLabel &&
        matchesAssignee &&
        matchRepo
      );
    });
  }, [
    mockIssues,
    searchTerm,
    statusFilter,
    labelFilter,
    assigneeFilter,
    repoFilter,
  ]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span> Failed to load issues. Please try again.</span>
        </div>
      </div>
    );
  }

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
      <Card className="rounded-none">
        <CardContent className="">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search issues, repos, or owners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-none"
                />
              </div>
            </div>

            <Select value={repoFilter} onValueChange={setRepoFilter}>
              <SelectTrigger className="w-full rounded-none sm:w-48">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All repository</SelectItem>
                {allRepo?.map((r) => (
                  <SelectItem key={r} value={r as string}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-none sm:w-48">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Language</SelectItem>
                {language?.map((lang) => (
                  <SelectItem key={lang} value={lang as string}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={labelFilter} onValueChange={setLabelFilter}>
              <SelectTrigger className="w-full rounded-none sm:w-48">
                <SelectValue placeholder="Filter by label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Labels</SelectItem>
                {labels.map((label) => (
                  <SelectItem key={label} value={label as string}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={assigneeFilter}
              onValueChange={(value) => setAssigneeFilter(value)}
            >
              <SelectTrigger className="w-full rounded-none sm:w-48">
                <SelectValue placeholder="Filter by assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
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
                setRepoFilter("all");
              }}
            >
              Clear Filters
            </Button>

            <Button variant={"outline"} onClick={() => refetch()}>
              <RefreshCcw />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issues Table */}
      <Card className=" rounded-none">
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
                {searchTerm || statusFilter !== "all"
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
