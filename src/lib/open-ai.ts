import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  static async generateIssueDescription(issue: any): Promise<string> {
    const prompt = `
    Create a brief, engaging description for this GitHub issue:
    
    Repository: ${issue.repository?.name || "Unknown"}
    Issue #${issue.number}: ${issue.title}
    
    Body: ${issue.body || "No description provided"}
    
    Labels: ${issue.labels?.map((l: any) => l.name).join(", ") || "None"}
    
    Please create a concise, informative summary that highlights the key points and makes it easy to understand what the issue is about.
    `;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
      });

      return (
        response.choices[0]?.message?.content ||
        "Unable to generate description"
      );
    } catch (error) {
      console.error("Error generating AI description:", error);
      return issue.body || "No description available";
    }
  }
}
