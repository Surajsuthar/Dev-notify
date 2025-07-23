-- CreateTable
CREATE TABLE "UserRepo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRepo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repo" (
    "id" TEXT NOT NULL,
    "node_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT,
    "full_name" TEXT NOT NULL,
    "github_url" TEXT NOT NULL,
    "homepage_url" TEXT,
    "stars" TEXT NOT NULL,
    "language" TEXT,
    "topics" TEXT[],
    "issues" TEXT NOT NULL,

    CONSTRAINT "Repo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRepo_userId_repoId_key" ON "UserRepo"("userId", "repoId");

-- CreateIndex
CREATE UNIQUE INDEX "Repo_node_id_key" ON "Repo"("node_id");

-- AddForeignKey
ALTER TABLE "UserRepo" ADD CONSTRAINT "UserRepo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRepo" ADD CONSTRAINT "UserRepo_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
