const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 PUT YOUR REAL API KEY HERE
const genAI = new GoogleGenerativeAI("AIzaSyD-kJQesXSWoDMIkD6ddpOGByx6S51ifUo");

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.json({ reply });

  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({
      reply: "AI service is currently unavailable. Please try again."
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
