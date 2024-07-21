// openAI.ts
import OpenAI from "openai";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
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

async function fetchChatCompletion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const imageURL = req.body[0].content[0].image_url.url || "";
  console.log("imageURL: \n", imageURL);
  const messages: Message[] = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Given an image with various food items, list each item followed by its approximate quantity in a simple, structured format suitable for processing by an API. For example, if the image contains 3 tablespoons of hummus, 1/2 cup of shredded red cabbage, and 8 pieces of baked pita chips, format your response as follows: ["3 tablespoons of hummus", "1/2 cup of shredded red cabbage", "8 pieces of baked pita chips"].`,
        },
        {
          type: "image_url",
          image_url: { url: imageURL },
        },
      ],
    },
  ];

  // console.log("messages: \n", JSON.stringify(messages, null, 2));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as OpenAI.Chat.ChatCompletionMessage[],
    });
    const latestResponse = response.choices[0].message.content;
    res.locals.openaiResponse = latestResponse || "";
    console.log("openaiResponse: \n", latestResponse);
    next();
  } catch (error) {
    console.error("API Error: ", error);
    res.status(500).json({ error: error.message });
  }
}

export default { fetchChatCompletion };
