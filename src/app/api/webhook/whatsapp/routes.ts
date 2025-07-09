import { NextApiRequest, NextApiResponse } from 'next'
import { WhatsAppService } from '@/lib/twilllio'
import { GitHubService } from '@/lib/github'
import { db } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { From, Body } = req.body
    const phoneNumber = From.replace('whatsapp:', '')

    const user = await db.user.findFirst({
      where: { whatsappNumber: phoneNumber },
      include: { accounts: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const reply = WhatsAppService.parseReply(Body)
    if (!reply) {
      await WhatsAppService.sendMessage(
        phoneNumber,
        'Invalid format. Please reply with: "issue_number your comment"'
      )
      return res.json({ success: true })
    }

    const trackedIssue = await db.trackedIssue.findFirst({
      where: {
        issueNumber: reply.issueNumber,
        userId: user.id
      }
    })

    if (!trackedIssue) {
      await WhatsAppService.sendMessage(
        phoneNumber,
        `Issue #${reply.issueNumber} not found in your tracked issues.`
      )
      return res.json({ success: true })
    }

    const account = user.accounts.find(acc => acc.provider === 'github')
    if (!account?.access_token) {
      await WhatsAppService.sendMessage(
        phoneNumber,
        'GitHub access token not found. Please re-authenticate.'
      )
      return res.json({ success: true })
    }

    // Post comment to GitHub
    const github = new GitHubService(account.access_token)
    await github.createComment(
      trackedIssue.repoOwner,
      trackedIssue.repoName,
      trackedIssue.issueNumber,
      reply.comment
    )

    await WhatsAppService.sendMessage(
      phoneNumber,
      `✅ Comment posted successfully to issue #${reply.issueNumber} in ${trackedIssue.repoName}`
    )

    res.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}