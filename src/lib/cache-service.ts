// import { db } from './prisma'
// import { GitHubService } from './github'

// export class CacheService {
//   private static CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

//   static async getCachedStarredRepos(userId: string, accessToken: string) {
//     const now = new Date()
//     const cacheExpiry = new Date(now.getTime() - this.CACHE_DURATION)

//     // Check if we have recent cached data
//     const cachedRepos = await db.userStarredRepo.findMany({
//       where: {
//         userId,
//         lastChecked: {
//           gte: cacheExpiry
//         }
//       },
//       include: {
//         user: true
//       }
//     })

//     if (cachedRepos.length > 0) {
//       console.log(`Using cached starred repos for user ${userId}`)
//       return cachedRepos.map(repo => ({
//         id: repo.repoId,
//         name: repo.repoName,
//         full_name: `${repo.repoOwner}/${repo.repoName}`,
//         owner: {
//           login: repo.repoOwner,
//           id: repo.repoId
//         }
//       }))
//     }

//     // Fetch fresh data from GitHub
//     console.log(`Fetching fresh starred repos for user ${userId}`)
//     const github = new GitHubService(accessToken)
//     const starredRepos = await github.getStarredRepos()

//     // Cache the results
//     await this.cacheStarredRepos(userId, starredRepos)

//     return starredRepos
//   }

//   static async getCachedIssues(repoOwner: string, repoName: string, accessToken: string) {
//     const now = new Date()
//     const cacheExpiry = new Date(now.getTime() - this.CACHE_DURATION)

//     // Check if we have recent cached issues
//     const cachedIssues = await db.cachedIssue.findMany({
//       where: {
//         repoOwner,
//         repoName,
//         lastChecked: {
//           gte: cacheExpiry
//         }
//       }
//     })

//     if (cachedIssues.length > 0) {
//       console.log(`Using cached issues for ${repoOwner}/${repoName}`)
//       return cachedIssues.map(issue => ({
//         id: issue.id,
//         number: issue.number,
//         title: issue.title,
//         body: issue.body,
//         state: issue.state,
//         created_at: issue.createdAt.toISOString(),
//         updated_at: issue.updatedAt.toISOString(),
//         html_url: issue.htmlUrl
//       }))
//     }

//     // Fetch fresh issues from GitHub
//     console.log(`Fetching fresh issues for ${repoOwner}/${repoName}`)
//     const github = new GitHubService(accessToken)
//     const issues = await github.getIssues(repoOwner, repoName)

//     // Cache the issues
//     await this.cacheIssues(repoOwner, repoName, issues)

//     return issues
//   }

//   private static async cacheStarredRepos(userId: string, repos: any[]) {
//     const cacheData = repos.map(repo => ({
//       userId,
//       repoId: repo.id,
//       repoName: repo.name,
//       repoOwner: repo.owner.login,
//       lastChecked: new Date()
//     }))

//     // Use upsert to avoid duplicates
//     for (const repo of cacheData) {
//       await db.userStarredRepo.upsert({
//         where: {
//           userId_repoId: {
//             userId: repo.userId,
//             repoId: repo.repoId
//           }
//         },
//         update: {
//           lastChecked: repo.lastChecked
//         },
//         create: repo
//       })
//     }
//   }

//   private static async cacheIssues(repoOwner: string, repoName: string, issues: any[]) {
//     const cacheData = issues.map(issue => ({
//       id: issue.id,
//       number: issue.number,
//       title: issue.title,
//       body: issue.body,
//       state: issue.state,
//       createdAt: new Date(issue.created_at),
//       updatedAt: new Date(issue.updated_at),
//       htmlUrl: issue.html_url,
//       repoName,
//       repoOwner,
//       lastChecked: new Date()
//     }))

//     // Use upsert to avoid duplicates
//     for (const issue of cacheData) {
//       await db.cachedIssue.upsert({
//         where: {
//           number_repoName_repoOwner: {
//             number: issue.number,
//             repoName: issue.repoName,
//             repoOwner: issue.repoOwner
//           }
//         },
//         update: {
//           title: issue.title,
//           body: issue.body,
//           state: issue.state,
//           updatedAt: issue.updatedAt,
//           lastChecked: issue.lastChecked
//         },
//         create: issue
//       })
//     }
//   }

//   static async clearOldCache() {
//     const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

//     await db.cachedIssue.deleteMany({
//       where: {
//         lastChecked: {
//           lt: oneDayAgo
//         }
//       }
//     })

//     await db.userStarredRepo.deleteMany({
//       where: {
//         lastChecked: {
//           lt: oneDayAgo
//         }
//       }
//     })
//   }
// }
