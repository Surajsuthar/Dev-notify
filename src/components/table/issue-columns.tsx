"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle, Calendar, GitBranch } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export type Issue = {
  id: string;
  issueNumber: number;
  repoName: string;
  repoOwner: string;
  title: string;
  body?: string;
  createdAt: Date;
  status: "open" | "closed" | "draft";
  priority: "low" | "medium" | "high" | "urgent";
  labels: string[];
  assignees: string[];
  comments: number;
  reactions: number;
};

export const issueColumns: ColumnDef<Issue>[] = [
  {
    accessorKey: "issueNumber",
    header: "#",
    cell: ({ row }) => {
      const issue = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            #{issue.issueNumber}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const issue = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="font-medium">{issue.title}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="w-3 h-3" />
            <span>
              {issue.repoOwner}/{issue.repoName}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusColor = (status: string) => {
        switch (status) {
          case "open":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
          case "closed":
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
          case "draft":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
          default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
      };

      return (
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const getPriorityColor = (priority: string) => {
        switch (priority) {
          case "urgent":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
          case "high":
            return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
          case "medium":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
          case "low":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
          default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
      };

      return (
        <Badge className={getPriorityColor(priority)}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "labels",
    header: "Labels",
    cell: ({ row }) => {
      const labels = row.getValue("labels") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {labels.slice(0, 2).map((label, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
          {labels.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{labels.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDistanceToNow(date, { addSuffix: true })}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => {
      const comments = row.getValue("comments") as number;
      const reactions = row.original.reactions;
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="w-3 h-3" />
          <span>{comments}</span>
          {reactions > 0 && (
            <span className="text-xs">+{reactions} reactions</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const issue = row.original;
      const githubUrl = `https://github.com/${issue.repoOwner}/${issue.repoName}/issues/${issue.issueNumber}`;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(githubUrl, "_blank")}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      );
    },
  },
];
