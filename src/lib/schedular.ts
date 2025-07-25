import cron from "node-cron";
import { db } from "./prisma";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import { getAllIssuesFromGithub } from "../../module/repo/repo";

export class IssueScheduler {
  static start() {
    cron.schedule("0 * * * *", async () => {
      console.log("Checking for new issues...");
      await this.checkForNewIssues();
    });
  }

  static async checkForNewIssues() {
    try {
      await this.deleteOldIssues();
      await getAllIssuesFromGithub();
    } catch (error) {
      console.error("Error checking for new issues:", error);
    }
  }

  static async deleteOldIssues() {
    try {
      await db.issueTracker.deleteMany({
        where: {
          createdAt: {
            lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          },
        },
      });
      console.log("Deleted old issues");
    } catch (error) {
      if (error instanceof PrismaClientInitializationError) {
        console.error("Error deleting old issues:", error);
      }
    }
  }
}
