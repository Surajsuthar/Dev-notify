"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { getUser } from "../../../module/user/user";
import { updateTelegramUsername } from "../../../module/user/user";
import { ArrowRightIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";

interface UsernameProviderProps {
  children: React.ReactNode;
}

export const UsernameProvider = ({ children }: UsernameProviderProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [telegramUsername, setTelegramUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (status === "loading") return;

      if (!session?.user) {
        router.push("/");
        return;
      }

      try {
        const userData = await getUser(session.user.email);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkUser();
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!telegramUsername.trim() || !session?.user) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Updating Telegram username for user:", session.user);
      const updatedUser = await updateTelegramUsername(
        session.user.email,
        telegramUsername.trim(),
      );

      if (updatedUser) {
        setUser(updatedUser);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating Telegram username:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <Skeleton className="max-w-[500px] h-[200px] w-full" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  if (user?.telegramUsername) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-left">
            Welcome
          </CardTitle>
          <CardDescription>
            Enter Telegram username for notification on issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="telegramUsername"
                  className="text-sm font-medium"
                >
                  Telegram username
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="telegramUsername"
                    type="text"
                    className="w-full"
                    placeholder="Enter your Telegram username"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            onClick={handleSubmit}
            disabled={isLoading || !telegramUsername.trim()}
          >
            {isLoading ? "Saving..." : "Proceed"}
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
