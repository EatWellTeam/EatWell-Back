// openAI.ts
import OpenAI from "openai";
import dotenv from "dotenv";
// import readline from "readline";
import path from "path";
import fs from "fs";
dotenv.config();

export interface Message {
  role: "user" | "assistant";
  content?: [
    { type: "text"; text: string },
    { type: "image"; image_url: string }
  ];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const userInterface = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// async function promptUser() {
//   userInterface.prompt();
//   userInterface.on("line", async (input) => {
//     console.log("User:", input);
//     const fileExists = fs.existsSync(path.join(__dirname, input));
//     const imageUrl = fileExists ? path.join(__dirname, input) : undefined;
//     const messages: Message[] = [
//       {
//         role: "user",
//         content: [
//           { type: "text", text: input },
//           { type: "image", image_url: imageUrl },
//         ],
//       },
//     ];

//     try {
//       const response = await fetchChatCompletion(messages);
//       console.log("ChatGPT:", response);
//       promptUser(); // Loop back to continue the conversation
//     } catch (error) {
//       console.error("API Error: ", error.message);
//       userInterface.close();
//     }
//   });
// }

async function fetchChatCompletion(messages: Message[]): Promise<string> {
  console.log("messages: \n", messages);

  const normalImagePath = path.join(__dirname, "../backend/public/images.jpeg");
  console.log("normalImagePath: ", normalImagePath);
  const imageExists = fs.existsSync(normalImagePath);
  console.log("imageExists: ", imageExists);
  const imageUrl = imageExists ? normalImagePath : undefined;
  console.log("imageUrl: ", imageUrl);
  const formattedMessages = messages.map((message) => {
    // If you need to modify content to include an image URL, do it here
    const content = message.content
      ? message.content.map((contentItem) => {
          if ("image_url" in contentItem) {
            return { ...contentItem, image_url: imageUrl }; // Modify as needed
          }
          return contentItem;
        })
      : null;
    console.log("content object: ", content);
    return {
      role: message.role,
      content: content ? JSON.stringify(content) : null, // Now stringify the modified content
    };
  });

  console.log("formattedMessages content for image: ", formattedMessages);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: formattedMessages,
  });
  const latestResponse = response.choices[0].message.content;
  // console.log("latestResponse", latestResponse);
  return latestResponse;
}
export { fetchChatCompletion };
