import cron from "node-cron";
import { getAllIssuesFromGithub } from "@/module/repo/repo";

export class IssueScheduler {
  static start() {
    cron.schedule("0 * * * *", async () => {
      console.log("Checking for new issues...");
      await this.checkForNewIssues();
    });
  }

  static async checkForNewIssues() {
    try {
      await getAllIssuesFromGithub();
    } catch (error) {
      console.error("Error checking for new issues:", error);
    }
  }
}
