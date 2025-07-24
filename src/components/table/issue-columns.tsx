"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle, Calendar, GitBranch, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { IssueDataTableType } from "@/types";

export const issueColumns: ColumnDef<IssueDataTableType>[] = [
  {
    accessorKey: "issueNumber",
    header: "#",
    cell: ({ row }) => {
      const issue = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            #{issue.issueNumber || 0}
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
          <div className="font-medium flex items-center gap-1">
            {issue.title && issue.title.length > 40
              ? issue.title.slice(0, 40)
              : issue.title}
            {issue.title && issue.title.length > 40 && (
              <HoverCard>
                <HoverCardTrigger>
                  <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <span className="text-sm text-muted-foreground">
                    {issue.title}
                  </span>
                </HoverCardContent>
              </HoverCard>
            )}  
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="w-3 h-3" />
            <span>
              {issue.owner}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "state",
    header: "Status",
    cell: ({ row }) => {
      const state = row.getValue("state") as string;
      const getstateColor = (state: string) => {
        switch (state) {
          case "open":
            return "bg-green-500/20 text-green-500 font-bold dark:bg-green-900 dark:text-green-300";
          case "closed":
            return "bg-gray-500/20 text-gray-500 font-bold dark:bg-gray-900 dark:text-gray-300";
          default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
      };

      return (
        <Badge className={getstateColor(state)}>
          {state}
        </Badge>
      );
    },
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => {
      const language = row.getValue("language") as string;
      return <Badge className={`rounded-md bg-blue-400/80 px-2 py-1 text-xs font-medium ${language ? "text-white" : "text-muted-foreground"}`}>{language ? language : "No language"}</Badge>;
    },
  },
  {
    accessorKey: "labels",
    header: "Labels",
    cell: ({ row }) => {
      const labels = row.getValue("labels") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {labels.length === 0 && <Badge variant="outline" className="text-xs">No labels</Badge>}
          {labels.slice(0, 2).map((label, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-500">
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
      const date = row.getValue("createdAt") as string;
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
          {(
            <span className="text-xs">+{reactions ? reactions : 0} reactions</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "assignees",
    header: "Assigned",
    cell: ({ row }) => {
      const assignees = row.getValue("assignees") as boolean;
      return (
        <div className="flex items-center justify-center gap-1 text-muted-foreground">
          {assignees ? "Yes" : "No"}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const issue = row.original;
      const githubUrl = issue.issue_url;

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
