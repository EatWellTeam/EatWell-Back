// openAI.ts
import OpenAI from "openai";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchChatCompletion(messages: Message[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  const latestResponse = response.choices[0].message.content;
  console.log(latestResponse);
  return latestResponse;
}

// Example usage
async function continueConversation() {
  const conversationHistory: Message[] = [
    { role: "user", content: "Say this is a test" },
  ];

  // Initial call
  let response = await fetchChatCompletion(conversationHistory);
  conversationHistory.push({ role: "assistant", content: response });

  // Continue the conversation
  conversationHistory.push({
    role: "user",
    content: "How about another question?",
  });
  response = await fetchChatCompletion(conversationHistory);
  conversationHistory.push({ role: "assistant", content: response });
}

export { fetchChatCompletion, continueConversation };
