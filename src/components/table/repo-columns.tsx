"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ExternalLink, Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import Link from "next/link";
import { RepoDataTableType } from "@/types";
import { roundUpFormat } from "@/lib/utils";

export const repoColumns: ColumnDef<RepoDataTableType>[] = [
  {
    accessorKey: "Sr. No.",
    header: "No.",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{row.index + 1}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Link
            href={row.original.homepage_url || ""}
            target="_blank"
            className="hover:underline"
          >
            <span className="text-md font-medium">
              {row.original.name.charAt(0).toUpperCase() +
                row.original.name.slice(1)}
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2">
            {row.original.description && row.original.description.length > 40
              ? row.original.description.slice(0, 40)
              : row.original.description || "No description"}
            {row.original.description &&
              row.original.description.length > 40 && (
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <span className="text-sm text-muted-foreground">
                      {row.original.description}
                    </span>
                  </HoverCardContent>
                </HoverCard>
              )}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-400/80 px-2 py-1 text-xs font-medium">
            {row.original.language ? row.original.language : "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "topics",
    header: "Topics",
    cell: ({ row }) => {
      const topics = row.getValue("topics") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {topics.slice(0, 2).map((topic, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {topic ? topic : "No topic"}
            </Badge>
          ))}
          {topics.length > 2 && (
            <HoverCard>
              <HoverCardTrigger>
                <Badge variant="outline" className="text-xs cursor-pointer">
                  +{topics.length - 2}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent>
                {topics.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {topic ? topic : "No topic"}
                  </Badge>
                ))}
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "issues",
    header: "Issues",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Badge variant={"default"} className="bg-green-400/80">
            {roundUpFormat(row.original.issues)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "stars",
    header: "Stars",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span>{roundUpFormat(row.original.stars)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const link = row.original.github_url;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(link, "_blank")}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      );
    },
  },
];
