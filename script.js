const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Body parser middleware to parse JSON requests
app.use(bodyParser.json());

app.post('/proxy', async (req, res) => {
  const prompt = req.body.prompt;
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful expert owl assistant who answers all questions about CMD, CCTV, and electronics clearly and politely." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 300
      })
    });

    const data = await response.json();
    const owlResponse = data.choices?.[0]?.message?.content?.trim() || "No response from the owl.";
    res.json({ response: owlResponse });

  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ response: "The owl encountered a glitch in the forest." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
