import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAIClient(): Anthropic {
  if (!client) {
    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface ServerStructure {
  categories: Array<{
    name: string;
    position?: number;
    channels: Array<{
      name: string;
      type: "text" | "voice" | "announcement" | "forum";
      topic?: string;
      slowmode?: number;
    }>;
  }>;
  roles: Array<{
    name: string;
    color?: string;
    hoist?: boolean;
    mentionable?: boolean;
    permissions?: string[];
  }>;
}

export async function generateServerStructure(
  description: string,
  serverType: string,
  language: string,
): Promise<ServerStructure> {
  const ai = getAIClient();

  const langInstruction =
    language === "fr"
      ? "Génère TOUT en français (noms de catégories, channels, rôles)."
      : language === "es"
        ? "Genera TODO en español (nombres de categorías, canales, roles)."
        : "Generate EVERYTHING in English (category names, channels, roles).";

  const prompt = `You are an expert Discord server architect. Generate a complete, professional Discord server structure based on this description.

Server description: "${description}"
Server type: ${serverType}
Language instruction: ${langInstruction}

Return a JSON object with this exact structure:
{
  "categories": [
    {
      "name": "CATEGORY NAME",
      "channels": [
        { "name": "channel-name", "type": "text", "topic": "optional topic" },
        { "name": "voice-channel", "type": "voice" }
      ]
    }
  ],
  "roles": [
    { "name": "Role Name", "color": "#hexcolor", "hoist": true, "mentionable": true }
  ]
}

Rules:
- Create 4-7 categories
- Each category should have 2-5 channels
- Create 5-8 roles (from highest to lowest: Admin, Moderator, etc.)
- Channel names must be lowercase with hyphens (no spaces)
- Category names should be UPPERCASE
- Include a mix of text and voice channels
- Be creative and tailored to the server type
- Colors should be hex codes like "#3498db"
- ONLY return valid JSON, no explanation`;

  const message = await ai.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected AI response type");
  }

  // Extract JSON from response
  const text = content.text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in AI response");
  }

  return JSON.parse(jsonMatch[0]) as ServerStructure;
}
