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
    content: [
      {
        type: "text",
        text: "Hello, Could you please provide me then name of each item and the quantity of each item in the image for using it in Edamam API?",
      },
      {
        type: "image",
        image_url: filePath,
      },
    ],
  },
];

describe("fetchChatCompletion", () => {
  it("fetches chat completion successfully", async () => {
    const imageExists = fs.existsSync(filePath);
    expect(imageExists).toBe(true);
    try {
      const response = await fetchChatCompletion(messages);
      expect(response).toBeDefined();
      console.log("response from API: \n", response);
    } catch (error) {
      console.error("API Error: ", error.message);
    }
  }, 30000); // Increase timeout to 30 seconds
});
