import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token required" },
        { status: 400 },
      );
    }

    const githubService = new GitHubService(accessToken);

    // Your webhook URL (replace with your actual domain)
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhook/github`;
    const secret = process.env.GITHUB_WEBHOOK_SECRET || "your-webhook-secret";

    // Setup webhooks for all starred repos
    const results = await githubService.setupWebhooksForStarredRepos(
      webhookUrl,
      secret,
    );

    return NextResponse.json({
      success: true,
      message: `Setup webhooks for ${results.length} starred repos`,
      results,
    });
  } catch (error) {
    console.error("Failed to setup webhooks:", error);
    return NextResponse.json(
      { error: "Failed to setup webhooks" },
      { status: 500 },
    );
  }
}
