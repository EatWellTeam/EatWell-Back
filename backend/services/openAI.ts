// openAI.ts
import OpenAI from "openai";
import dotenv from "dotenv";
import { Request, Response,NextFunction} from "express";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ImageContent = {
  type: "image_url";
  image_url: { url: string };
};

type TextContent = {
  type: "text";
  text: string;
};

export type MessageContent = TextContent | ImageContent;

export interface Message {
  role: "user" | "assistant" | "system";
  content: string | MessageContent[];
}

async function fetchChatCompletion(req: Request, res: Response,next: NextFunction) {
  const messages: Message[] = req.body;

  console.log("messages: \n", JSON.stringify(messages, null, 2));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as OpenAI.Chat.ChatCompletionMessage[],
    });
    const latestResponse = response.choices[0].message.content;
    res.locals.openaiResponse = latestResponse||"";
    next();
  } catch (error) {
    console.error("API Error: ", error);
    res.status(500).json({ error: error.message });
  }
}

export default { fetchChatCompletion };
