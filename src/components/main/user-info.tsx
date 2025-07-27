"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Github,
  LogOut,
  Bell,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Activity,
} from "lucide-react";
import  { User } from "next-auth";

interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  stars: number;
  contributions: number;
}

interface NotificationSettings {
  whatsapp: boolean;
  email: boolean;
  telegram: boolean;
  urgentIssues: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
}

export const UserInfo = () => {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [githubStats, setGithubStats] = useState<GitHubStats>({
    publicRepos: 0,
    followers: 0,
    following: 0,
    stars: 0,
    contributions: 0,
  });
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      whatsapp: true,
      email: false,
      telegram: false,
      urgentIssues: true,
      dailyDigest: false,
      weeklyReport: true,
    });

  // Mock GitHub stats - in real app, fetch from GitHub API
  useEffect(() => {
    if (session?.user?.accessToken) {
      // Simulate fetching GitHub stats
      setTimeout(() => {
        setGithubStats({
          publicRepos: 24,
          followers: 156,
          following: 89,
          stars: 342,
          contributions: 1287,
        });
      }, 1000);
    }
  }, [session]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    // Simulate API call to save settings
    setTimeout(() => {
      setIsEditing(false);
      setLoading(false);
    }, 1000);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 animate-spin" />
          <span>Loading user profile...</span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Not authenticated</h3>
          <p className="text-muted-foreground">
            Please sign in to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={(session.user as User).image || ""} />
                <AvatarFallback>
                  {(session.user as User).name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {(session.user as User).name || "User"}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  @{session.user.githubLogin || "github-user"}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                className="w-full cursor-pointer"
                onClick={handleLogout}
                disabled={loading}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {loading ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        defaultValue={(session.user as any).name || ""}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={session.user.email || ""}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        placeholder="+1234567890"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telegram">Telegram Username</Label>
                      <Input
                        id="telegram"
                        placeholder="@username"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="github" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub Statistics
                  </CardTitle>
                  <CardDescription>
                    Your GitHub activity and repository information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {githubStats.publicRepos}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Repositories
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {githubStats.followers}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Followers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {githubStats.following}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Following
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {githubStats.stars}
                      </div>
                      <div className="text-sm text-muted-foreground">Stars</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {githubStats.contributions}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Contributions
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Connected to GitHub</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how you receive notifications about issues
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive daily digest emails
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.email}
                        onCheckedChange={(checked: boolean) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            email: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Telegram Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via Telegram
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.telegram}
                        onCheckedChange={(checked: boolean) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            telegram: checked,
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Urgent Issue Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Immediate notifications for urgent issues
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.urgentIssues}
                        onCheckedChange={(checked: boolean) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            urgentIssues: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Daily Digest</Label>
                        <p className="text-sm text-muted-foreground">
                          Summary of all issues daily
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyDigest}
                        onCheckedChange={(checked: boolean) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            dailyDigest: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Weekly Report</Label>
                        <p className="text-sm text-muted-foreground">
                          Weekly summary of your activity
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReport}
                        onCheckedChange={(checked: boolean) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            weeklyReport: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Account Status */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">GitHub Connected</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">WhatsApp</span>
                <Badge
                  variant={
                    notificationSettings.whatsapp ? "default" : "secondary"
                  }
                >
                  {notificationSettings.whatsapp
                    ? "Connected"
                    : "Not Connected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Telegram</span>
                <Badge
                  variant={
                    notificationSettings.telegram ? "default" : "secondary"
                  }
                >
                  {notificationSettings.telegram
                    ? "Connected"
                    : "Not Connected"}
                </Badge>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};
