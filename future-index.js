require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-report', async (req, res) => {
  try {
    const { input } = req.body;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Lemon Shield, an expert used car evaluator. Generate a professional, structured HTML report based on the input provided.",
        },
        {
          role: "user",
          content: input,
        }
      ],
    });

    const html = chatResponse.choices[0].message.content;
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Lemon Shield backend running on port ${PORT}`);
});

