"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "../ui/card";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";
import { Label } from "../ui/label";
import { CircleDot } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

interface RepoCardProps {
  name: string;
  description: string;
  language: string[];
  topics: string[];
  link: string;
  isForked: boolean;
  issues: number;
  avatar_url: string;
}

export const RepoCard = () => {
  return (
    <Card className="w-full h-full p-4" onClick={() => {}}>
      <CardHeader className="">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row space-x-4 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <CardTitle>Open Source</CardTitle>
          </div>
        </div>
        <CardDescription>
          Open Source software is software that is free to use, modify, and
          distribute.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-row gap-1 items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant={"outline"} className="text-sm bg-green-400/80">
              <CircleDot className="w-4 h-4" />
              Issues
              <p>100</p>
            </Button>
            <Button variant={"outline"} className="text-sm bg-blue-400/80">
              <Star className="w-4 h-4" />
              Stars
              <p>100</p>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <Label className="text-sm font-medium">Language:</Label>
          <div className="flex flex-wrap gap-1.5 items-center justify-start">
            {[...Array(8)].map((_, index) => (
              <Badge className="text-sm" variant={"secondary"} key={index}>
                <p>Python</p>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={"outline"}
          className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer"
          onClick={() => {}}
        >
          <p>View on GitHub</p>
        </Button>
      </CardFooter>
    </Card>
  );
};
