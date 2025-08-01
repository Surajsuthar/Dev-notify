import { useQuery } from "@tanstack/react-query";
import { getStarredReposForUser } from "@/module/repo/repo";
import { DataTable } from "../table/data-table";
import { repoColumns } from "../table/repo-columns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useMemo } from "react";
import { Search, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RepoDataTableType } from "@/types";

export const AllRepo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");

  const {
    data: userRepos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userRepos"],
    queryFn: () => getStarredReposForUser(),
  });

  const repos: RepoDataTableType[] = useMemo(() => {
    return (
      userRepos?.data?.map((repo) => ({
        ...repo,
        stars: Number(repo.stars),
        homepage_url: repo.homepage_url || "",
        issues: Number(repo.issues),
        topics: repo.topics || [],
        language: repo.language || "",
        description: repo.description || "",
      })) || []
    );
  }, [userRepos]);

  const languages = useMemo(() => {
    const langs = Array.from(
      new Set(repos.map((repo) => repo.language).filter(Boolean)),
    );
    langs.sort();
    return langs;
  }, [repos]);

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesSearch = repo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesLanguage =
        languageFilter === "all" || repo.language === languageFilter;
      return matchesSearch && matchesLanguage;
    });
  }, [repos, searchTerm, languageFilter]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span> Failed to load repositories. Please try again.</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span> Loading repositories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className=" rounded-none">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-none"
                />
              </div>
            </div>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-full rounded-none sm:w-48">
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setLanguageFilter("all");
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Repositories</span>
            <Badge variant="secondary">
              {filteredRepos.length}{" "}
              {filteredRepos.length === 1 ? "repo" : "repos"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Your starred repositories with GitHub data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRepos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-lg font-semibold mb-2">
                No repositories found
              </span>
              <p className="text-muted-foreground mb-4">
                {searchTerm || languageFilter !== "all"
                  ? "Try adjusting your search or language filter"
                  : "Star repositories to see them here"}
              </p>
            </div>
          ) : (
            <DataTable columns={repoColumns} data={filteredRepos} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
