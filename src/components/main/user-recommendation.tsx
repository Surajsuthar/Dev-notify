import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, RefreshCw, Star, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchGithubRepos } from "@/module/repo/repo";
import { Repo } from "@/types";

export const UserRecommendation = () => {
  const [language, setLanguage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);


  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const { data: recommendations, isError, isFetching } = useQuery({
    queryKey: ['user-recommendation', language, selectedLabels],
    queryFn: async () => {
      // Build search query based on filters
      let searchQuery = "stars:>100";
      
      if (language !== "all") {
        searchQuery += ` language:${language}`;
      }
      
      if (selectedLabels.length > 0) {
        selectedLabels.forEach(label => {
          searchQuery += ` topic:${label}`;
        });
      }

      const result = await searchGithubRepos(searchQuery);
      if (!result.success) {
        throw new Error(result.message || "Failed to search repositories");
      }
      return result.data;
    },
    enabled: !!language,
  });

  const repos: Repo[] = useMemo(() => {
    return Array.isArray(recommendations) ? recommendations : [];
  }, [recommendations]);

  const languages = [
     "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", 
    "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin", "Scala", "R", 
    "Dart", "Elixir", "Clojure", "Haskell", "Assembly"
  ];

  const availableLabels = [
    "react", "nextjs", "vue", "angular", "nodejs", "docker", 
    "kubernetes", "aws", "tailwind", "ai-agents", "llm", "machine-learning",
    "blockchain", "mobile", "database", "api", "microservices"
  ];

  const filteredRecommendations = useMemo(() => {
    return repos.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [repos, searchQuery]);

  return (
    <div className="flex gap-6 h-[700px] bg-background">
      <div className="w-80 bg-card border sticky top-0 h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
            <p className="text-sm text-muted-foreground">Find amazing projects and developers</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="search">Search Projects</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Programming Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
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
            </div>

            <div className="space-y-3">
              <Label>Technologies</Label>
              <div className="flex flex-wrap gap-2">
                {availableLabels.map((label) => (
                  <Badge
                    key={label}
                    variant={selectedLabels.includes(label) ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => toggleLabel(label)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(language !== "all" || selectedLabels.length > 0 || searchQuery) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Active Filters</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setLanguage("all");
                      setSelectedLabels([]);
                      setSearchQuery("");
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {language !== "all" && (
                    <Badge variant="outline" className="text-xs">
                      {language}
                    </Badge>
                  )}
                  {selectedLabels.map(label => (
                    <Badge key={label} variant="outline" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Recommended for You</h1>
              <p className="text-muted-foreground mt-2">
                Showing {filteredRecommendations.length} repositories
              </p>
            </div>
          </div>

          {/* Loading */}
          {isFetching && (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span> Loading recommendations...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {isError && !isFetching && (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span> Failed to load recommendations. Please try again.</span>
              </div>
            </div>
          )}

          {/* Recommendations Grid */}
          {!isFetching && !isError && (
            <div className="grid gap-6">
              {filteredRecommendations.map((item) => (
                <Card key={item.node_id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-xl hover:text-primary cursor-pointer">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          by {item.owner}
                        </CardDescription>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <a href={item.github_url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    <p className="text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {(item.topics || []).map((label) => (
                        <Badge key={label} variant="secondary" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span>{Number(item.stars).toLocaleString()}</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-blue-400/80">
                          {item.language}
                        </Badge>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {!isFetching && !isError && filteredRecommendations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};