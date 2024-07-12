// openAI.ts
import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";
import path from "path";
import fs from "fs";
dotenv.config();

export interface Message {
  role: "user" | "assistant";
  content?: string;
  image_url?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUser() {
  userInterface.prompt();
  userInterface.on("line", async (input) => {
    const fileExists = fs.existsSync(path.join(__dirname, input));
    const isImageUrl = fileExists && input.includes(".jpeg");
    const messages: Message[] = [
      {
        role: "user",
        content: isImageUrl ? undefined : input,
        image_url: isImageUrl ? path.join(__dirname, input) : undefined,
      },
      {
        role: "assistant",
        content: "",
      },
    ];

    try {
      const response = await fetchChatCompletion(messages);
      console.log("ChatGPT:", response);
      promptUser(); // Loop back to continue the conversation
    } catch (error) {
      console.error("API Error: ", error.message);
      userInterface.close();
    }
  });
}

async function fetchChatCompletion(messages: Message[]): Promise<string> {
  const formattedMessages = messages.map((message) => {
    return {
      role: message.role,
      content: message.content,
      image: message.image_url,
    };
  });
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: formattedMessages,
  });
  const latestResponse = response.choices[0].message.content;
  // console.log("latestResponse", latestResponse);
  return latestResponse;
}
export { promptUser, fetchChatCompletion };
