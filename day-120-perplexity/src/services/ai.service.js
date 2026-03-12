import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

export async function testAi() {
    model.invoke("Can AI will replace full stack developers or software engineers?, please explain in short.")
    .then((response) => {
        console.log(response.text)
    })
}