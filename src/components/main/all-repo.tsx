import { useQuery } from "@tanstack/react-query";
import { getAllWithGithub } from "../../../module/repo/repo";
import { DataTable } from "../table/data-table";
import { repoColumns } from "../table/repo-columns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useMemo } from "react";
import { Search, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const AllRepo = () => {

  const { data: userRepos, isLoading } = useQuery({
    queryKey: ["userRepos"],
    queryFn: () => getAllWithGithub(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");

  const repos = userRepos?.data?.map((repo) => ({
    ...repo,
    link: repo.html_url,
    id: repo.github_id.toString(),
    avatar_url: repo.avatar_url,
    stars: repo.stars,
    issues: repo.issues,
    topics: repo.topics || [],
    language: repo.language || "",
    description: repo.description || "",
  })) || [];


  const languages = useMemo(() => {
    const langs = Array.from(new Set(repos.map((repo) => repo.language).filter(Boolean)));
    langs.sort();
    return langs;
  }, [repos]);

  const filteredRepos = repos.filter((repo) => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = languageFilter === "all" || repo.language === languageFilter;
    return matchesSearch && matchesLanguage;
  });

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
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Repositories</span>
            <Badge variant="secondary">
              {filteredRepos.length} {filteredRepos.length === 1 ? "repo" : "repos"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Your starred repositories with GitHub data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRepos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-lg font-semibold mb-2">No repositories found</span>
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
