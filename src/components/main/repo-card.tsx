"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "../ui/card";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ExternalLink, Link, Star } from "lucide-react";
import { Label } from "../ui/label";
import { CircleDot } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

interface RepoCardProps {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[] | null;
  link: string | null;
  isForked: boolean;
  issues: number | null;
  avatar_url: string;
  stars: number | null;
}

export const RepoCard = ({
  name,
  description,
  language,
  topics,
  link,
  issues,
  avatar_url,
  stars,
}: RepoCardProps) => {
  // Helper to get initials from repo name
  const getInitials = (str: string) => {
    return str
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full h-full p-4">
      <CardHeader>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row space-x-4 items-center">
            <Avatar>
              <AvatarImage src={avatar_url} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <CardTitle>{name}</CardTitle>
          </div>
        </div>
        <CardDescription>
          {description || (
            <span className="text-muted-foreground">No description</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              className="text-sm bg-green-400/80 flex items-center gap-1"
              type="button"
            >
              <CircleDot className="w-4 h-4" />
              <span>Issues</span>
              <span>{issues ?? 0}</span>
            </Button>
            <Button
              variant={"outline"}
              className="text-sm bg-blue-400/80 flex items-center gap-1"
              type="button"
            >
              <Star className="w-4 h-4" />
              <span>Stars</span>
              <span>{stars ?? 0}</span>
            </Button>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Label className="text-sm font-medium">Language:</Label>
          <Badge className="text-sm" variant={"secondary"}>
            <span>{language || "N/A"}</span>
          </Badge>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <Label className="text-sm font-medium">Topics:</Label>
          <div className="flex flex-wrap gap-1">
            {topics && topics.length > 0 ? (
              topics.map((topic) => (
                <Badge key={topic} className="text-sm" variant={"secondary"}>
                  <span>{topic}</span>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">No topics</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={"default"}
          className="w-full cursor-pointer flex items-center gap-2"
          onClick={() => {
            if (link) {
              window.open(link, "_blank");
            }
          }}
          type="button"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};
