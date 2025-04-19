const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/proxy', async (req, res) => {
  const prompt = req.body.prompt;
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "text-davinci-003",  // You can swap this with gpt-3.5-turbo if using /chat/completions
      prompt: `🦉 Owl says: ${prompt}`,
      max_tokens: 100,
      temperature: 0.7
    })
  });

  const data = await response.json();
  res.json({ response: data.choices?.[0]?.text?.trim() || "No reply from owl." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
