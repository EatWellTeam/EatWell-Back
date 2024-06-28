// openAI.test.ts

import env from "dotenv";
env.config();
import { continueConversation } from "../../services/openAI";
describe("fetchChatCompletion", () => {
  it("fetches chat completion successfully", async () => {
    const response = await continueConversation();
    expect(response).toBeDefined();
    console.log("response: ", response);
  });
});
