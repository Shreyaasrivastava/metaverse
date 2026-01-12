const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 1. YOUR API KEY
const genAI = new GoogleGenerativeAI("AIzaSyBd53rPDgt6jITanrIpyrQO_s3F_7pckLA");

app.post("/chat", async (req, res) => {
  // Use the 2026 Stable IDs.
  // gemini-3-flash is currently the default for high-speed, web-aware apps.
  const modelsToTry = [
    "gemini-3-flash", 
    "gemini-2.5-flash", 
    "gemini-2.0-flash-001"
  ];

  for (let modelId of modelsToTry) {
    try {
      console.log(`Attempting to reach: ${modelId}`);
      
      // Configuration to enable Live Web Search (Grounding)
      const model = genAI.getGenerativeModel({ 
        model: modelId,
        // Enabling the Search tool allows the AI to "Google" information
        tools: [{ googleSearch: {} }] 
      });

      const prompt = `You are the official AI guide for the Banasthali Vidyapith Metaverse. 
      Answer the user's question using your knowledge and live web data to ensure accuracy about campus events, pool timings, and rules.
      User Question: ${req.body.message}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log(`Success with ${modelId}`);
      return res.json({ reply: text }); 
      
    } catch (error) {
      console.warn(`${modelId} failed: ${error.message}`);
    }
  }

  res.status(500).json({
    reply: "I'm experiencing a high-frequency routing update. Please try again in a moment.",
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));