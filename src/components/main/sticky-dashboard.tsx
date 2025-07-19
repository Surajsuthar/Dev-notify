"use client";

import { useMemo, useState } from "react";
import { AllRepo } from "./all-repo";
import { Issues } from "./issues";
import { UserInfo } from "./user-info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MergeRequests } from "./merge-req";

interface TabConfig {
  id: string;
  label: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("issues");

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
        id: "merge-requests",
        label: "Merge Requests",
        title: "Merge Requests",
        description: "Manage your merge requests",
        component: <UserInfo />,
      },
    ],
    [],
  );

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <main className="w-full h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="p-6">
          <div className="flex flex-col space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md grid-cols-3">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="cursor-pointer"
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
              <p className="text-muted-foreground">{currentTab.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
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
