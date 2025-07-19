import cron from "node-cron";
import { db } from "./prisma";
import { GitHubService } from "./github";
import { auth } from "../../auth";

export class IssueScheduler {
  static start() {
    cron.schedule("* * * * *", async () => {
      console.log("Checking for new issues...");
      await this.checkForNewIssues();
    });
  }

  static async checkForNewIssues() {
    try {
      const users = await db.user.findMany({
        where: {
          whatsappNumber: { not: null },
        },
        include: {
          accounts: true,
        },
      });
    } catch (error) {
      console.error("Error checking for new issues:", error);
    }
  }
}
