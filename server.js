const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyCWH4Y6YWXyLR9_PvoBx_9t8ANIHw5MTmw");

app.post("/chat", async (req, res) => {
  // Use the standard stable identifiers
  const modelsToTry = [
    "gemini-1.5-flash", // High stability fallback
    "gemini-2.0-flash-exp", 
    "gemini-3-flash"
  ];

  for (let modelId of modelsToTry) {
    try {
      console.log(`Attempting to reach: ${modelId}`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelId,
        // Correct syntax for enabling Google Search grounding
        tools: [{ googleSearchRetrieval: {} }] 
      });

      const prompt = `You are the official AI guide for the Banasthali Vidyapith Metaverse. 
      Answer the user's question using your knowledge and live web data.
      User Question: ${req.body.message}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Safety Check: Ensure text exists before calling .text()
      const text = response.text();

      if (text) {
        console.log(`Success with ${modelId}`);
        return res.json({ reply: text });
      }
      
    } catch (error) {
      // LOG THE ACTUAL ERROR to your console to see why it failed
      console.error(`Error with ${modelId}:`, error.message);
    }
  }

  res.status(500).json({
    reply: "I'm having trouble connecting to the campus network right now. Please try again soon.",
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));