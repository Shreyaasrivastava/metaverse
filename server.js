const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 1. YOUR API KEY
const genAI = new GoogleGenerativeAI("AIzaSyCGRw4Uls7dgecM2uKf52AqrfLxm58WoWM");

app.post("/chat", async (req, res) => {
  // 2026 Active Model IDs
  const modelsToTry = [
    "gemini-3-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash-002",
  ];

  for (let modelId of modelsToTry) {
    try {
      console.log(`Attempting to reach: ${modelId}`);
      const model = genAI.getGenerativeModel({ model: modelId });

      const prompt = `You are the official AI guide for Banasthali Vidyapith. 
      Answer this question using your knowledge and current web data: ${req.body.message}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log(`Success with ${modelId}`);
      return res.json({ reply: text }); // Return immediately on success
    } catch (error) {
      console.warn(`${modelId} failed: ${error.message}`);
      // Continue to next model in list
    }
  }

  // If all fail
  res.status(500).json({
    reply: "I'm having a major system update. Please try again in 5 minutes.",
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));