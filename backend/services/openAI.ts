// openAI.ts
import OpenAI from "openai";
import dotenv from "dotenv";

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

type MessageContent = TextContent | ImageContent;

interface Message {
  role: "user" | "assistant" | "system";
  content: string | MessageContent[];
}

async function fetchChatCompletion(messages: Message[]): Promise<string> {
  console.log("messages: \n", JSON.stringify(messages, null, 2));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as OpenAI.Chat.ChatCompletionMessage[],
    });
    const latestResponse = response.choices[0].message.content;
    return latestResponse || "";
  } catch (error) {
    console.error("API Error: ", error);
    return error.message;
  }
}

export { fetchChatCompletion, Message, MessageContent };
