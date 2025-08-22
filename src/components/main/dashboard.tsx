"use client";

import { useMemo, useState } from "react";
import { AllRepo } from "./all-repo";
import { Issues } from "./issues";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRecommendation } from "./user-recommendation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getAllStarredReposFromGithub } from "@/module/repo/repo";

interface TabConfig {
  id: string;
  label: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("issues");
  const { data: session } = useSession();
  const tabs: TabConfig[] = useMemo(
    () => [
      {
        id: "issues",
        label: "Issues",
        title: "Tracked Issues",
        description: "Monitor issues from your starred repositories",
        component: <Issues />,
      },
      {
        id: "repositories",
        label: "Repositories",
        title: "GitHub Repositories",
        description: "Track your starred repositories and their issues",
        component: <AllRepo />,
      },
      {
        id: "user-recommnadation",
        label: "Recommendation",
        title: "Recommendation",
        description: "github repo and issues recommendation for user",
        component: <UserRecommendation />,
      },
    ],
    [],
  );

  useQuery({
    queryKey: ["starred-repos", session?.user?.name],
    queryFn: getAllStarredReposFromGithub,
    staleTime: Infinity,
    enabled: !!session?.user,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <main className="w-full h-screen flex flex-col">
      <div className="sticky border top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="p-4">
          <div className="flex justify-between w-full">
            <div className="flex flex-col space-y-6  w-full md:w-3/5">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full rounded-none max-w-md grid-cols-3">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="cursor-pointer rounded-none"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {currentTab.title}
                </h1>
                <p className="text-muted-foreground">
                  {currentTab.description}
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-6 justify-end py-2 rounded-lg">
                <div className="flex flex-col gap-2 items-end ">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback>
                      {session?.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-xl flex items-center justify-end gap-0.5 font-bold tracking-tight">
                      <p>{session?.user?.name}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical className="w-4 cursor-pointer h-4 ml-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[100px]">
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              signOut({
                                redirectTo: "/",
                              });
                            }}
                          >
                            Log out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full"
        >
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="h-full p-6">
              <div className="h-full">{tab.component}</div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
};
