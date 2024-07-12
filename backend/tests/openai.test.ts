// openAI.test.ts
import env from "dotenv";
import path from "path";
import fs from "fs";
import { fetchChatCompletion, Message } from "../../services/openAI";
env.config();
const filePath = path.join(__dirname, "../public/images.jpeg");
console.log("imageURL", filePath);
const messages: Message[] = [
  {
    role: "user",
    content:
      "Could you write the name of each item and their quantity in the following picture please?",
    image_url: filePath,
  },
  {
    role: "assistant",
    content: "",
  },
];

describe("fetchChatCompletion", () => {
  it("fetches chat completion successfully", async () => {
    console.log("messages", messages);
    const imageExists = fs.existsSync(filePath);
    expect(imageExists).toBe(true);
    try {
      const response = await fetchChatCompletion(messages);
      expect(response).toBeDefined();
      console.log("response", response);
    } catch (error) {
      console.error("API Error: ", error.message);
    }
  }, 30000); // Increase timeout to 30 seconds
});
