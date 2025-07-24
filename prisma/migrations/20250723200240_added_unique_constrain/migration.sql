/*
  Warnings:

  - A unique constraint covering the columns `[issueNumber,repoId]` on the table `IssueTracker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IssueTracker_issueNumber_repoId_key" ON "IssueTracker"("issueNumber", "repoId");
