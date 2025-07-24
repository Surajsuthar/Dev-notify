-- CreateTable
CREATE TABLE "IssueTracker" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issueNumber" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "label" TEXT[],
    "issue_url" TEXT NOT NULL,
    "assigned" BOOLEAN NOT NULL,
    "comments" INTEGER NOT NULL,
    "reactions" INTEGER NOT NULL,
    "repoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueTracker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IssueTracker" ADD CONSTRAINT "IssueTracker_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
