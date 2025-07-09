import cron from 'node-cron'
import { db } from './prisma'
import { GitHubService } from './github'
import { WhatsAppService } from './twilllio'
import { AIService } from './open-ai'

export class IssueScheduler {

  static start() {
    cron.schedule('* * * * *', async () => {
      console.log('Checking for new issues...')
      await this.checkForNewIssues()
    })
  }

  static async checkForNewIssues() {
    try {
      const users = await db.user.findMany({
        where: {
          whatsappNumber: { not: null }
        },
        include: {
          accounts: true
        }
      })

      for (const user of users) {
        const account = user.accounts.find(acc => acc.provider === 'github')
        if (!account?.access_token) continue

        const github = new GitHubService(account.access_token)
        const starredRepos = await github.getStarredRepos()
        
        for (const repo of starredRepos) {
          const issues = await github.getIssues(repo.owner.login, repo.name)
          for (const issue of issues) {
            const existingIssue = await db.trackedIssue.findUnique({
              where: {
                issueNumber_repoName_repoOwner: {
                  issueNumber: issue.number,
                  repoName: repo.name,
                  repoOwner: repo.owner.login
                }
              }
            })

            if (!existingIssue) {
              await db.trackedIssue.create({
                data: {
                  issueNumber: issue.number,
                  repoName: repo.name,
                  repoOwner: repo.owner.login,
                  title: issue.title,
                  body: issue.body,
                  userId: user.id
                }
              })

              // Generate AI description
            //   const aiDescription = await AIService.generateIssueDescription({
            //     ...issue,
            //     repository: repo
            //   })

              let message = `🚨 New Issue Alert!\n\n`
              message += `📁 Repository: ${repo.name}\n`
              message += `🔢 Issue #${issue.number}\n`
              message += `📝 Title: ${issue.title}\n\n`
            //   message += `📋 Description:\n${aiDescription}\n\n`
              message += `🔗 Link: ${issue.html_url}\n\n`
              message += `💬 Reply with "${issue.number} your comment" to respond`


              // Send WhatsApp notification
            //   if (user.whatsappNumber) {
            //     await WhatsAppService.sendMessage(user.whatsappNumber, message)
            //   }

            console.log("message",message)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking for new issues:', error)
    }
  }
}