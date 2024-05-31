import { GoogleGenerativeAI } from "@google/generative-ai"
export default async function getGeminiResponse(text) {

    const genAI = new GoogleGenerativeAI('AIzaSyD561YW4rc6MC0klycyDDKcCUD7cvtW6Ck');
    // ...

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = text

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text()
    // console.log(text);
    // return text.toString()
}