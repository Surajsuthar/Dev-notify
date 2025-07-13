import { NextRequest } from "next/server";
import { GitHubService } from "@/lib/github";
import { auth } from "../../../../auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { IssueScheduler } from "@/lib/schedular";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { accounts: true },
    });

    const account = user?.accounts.find((acc) => acc.provider === "github");

    // if (!account?.access_token) {
    //   return NextResponse.json({ error: 'GitHub token not found' }, { status: 400 })
    // }

    const github = new GitHubService(session.user.accessToken as string);

    const starredRepos = await github.getStarredRepos();
    console.log(starredRepos[0]);
    // IssueScheduler.start()
    return NextResponse.json({ starredRepos });
  } catch (error) {
    console.error("Error fetching starred repos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
