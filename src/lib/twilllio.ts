import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export class WhatsAppService {
  static async sendMessage(to: string, body: string) {
    try {
      const message = await client.messages.create({
        body,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:${to}`,
      });
      return message;
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      throw error;
    }
  }

  static parseReply(
    message: string,
  ): { issueNumber: number; comment: string } | null {
    const match = message.match(/^(\d+)\s+(.+)$/);
    if (match) {
      return {
        issueNumber: parseInt(match[1]),
        comment: match[2],
      };
    }
    return null;
  }
}
