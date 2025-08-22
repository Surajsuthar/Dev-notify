import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Star, Users, Calendar, ExternalLink } from "lucide-react";

export const UserRecommendation = () => {
  const [language, setLanguage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const languages = ["JavaScript", "TypeScript", "Python", "Java", "Go"];
  const availableLabels = ["react", "nextjs", "vue", "angular", "nodejs", "tailwind", "ui", "database"];

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const mockRecommendations = [
    {
      id: 1,
      title: "Modern React Dashboard Template",
      description: "A comprehensive dashboard built with React, TypeScript, and Tailwind CSS featuring responsive design and dark mode support.",
      author: "Sarah Chen",
      stars: 1250,
      language: "TypeScript",
      labels: ["react", "tailwind", "ui"],
      lastUpdated: "2 days ago",
      followers: 89
    },
    {
      id: 2,
      title: "Next.js E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration, admin panel, and customer management system.",
      author: "Mike Johnson",
      stars: 890,
      language: "JavaScript",
      labels: ["nextjs", "react", "database"],
      lastUpdated: "1 week ago",
      followers: 156
    },
    {
      id: 3,
      title: "Vue 3 Component Library",
      description: "Reusable Vue components with TypeScript support and comprehensive documentation for rapid development.",
      author: "Alex Rodriguez",
      stars: 567,
      language: "TypeScript",
      labels: ["vue", "ui", "nodejs"],
      lastUpdated: "3 days ago",
      followers: 73
    }
  ];

  const filteredRecommendations = mockRecommendations.filter(item => {
    const matchesLanguage = language === "all" || item.language === language;
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLabels = selectedLabels.length === 0 || 
      selectedLabels.some(label => item.labels.includes(label));
    
    return matchesLanguage && matchesSearch && matchesLabels;
  });

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

            <div className="space-y-3">
              <Label>Topics</Label>
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
                Showing {filteredRecommendations.length} projects
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Sort by Popularity
            </Button>
          </div>

          {/* Recommendations Grid */}
          <div className="grid gap-6">
            {filteredRecommendations.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-xl hover:text-primary cursor-pointer">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        by {item.author}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  <p className="text-sm leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.labels.map((label) => (
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
                        <span>{item.stars.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{item.followers}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{item.lastUpdated}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.language}
                    </Badge>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredRecommendations.length === 0 && (
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