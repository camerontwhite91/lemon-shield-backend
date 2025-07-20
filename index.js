require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ Lemon Shield backend is alive");
});

app.post("/lemonshield", async (req, res) => {
  const { year, make, model, transmission, mileage, price, notes } = req.body;

  console.log("✅ POST /lemonshield hit with:", req.body);

  try {
    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates detailed HTML reports for used car listings.",
          },
          {
            role: "user",
            content: `Write an HTML report for this car:
Year: ${year}
Make: ${make}
Model: ${model}
Transmission: ${transmission}
Mileage: ${mileage}
Price: ${price}
Notes from user: ${notes || "None"}
`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const htmlReport = gptResponse.data.choices[0].message.content;

    res.set("Content-Type", "text/html");
    res.send(htmlReport);
  } catch (err) {
    console.error("❌ Error from OpenAI:", err.response?.data || err.message);
    res.status(500).send("Failed to generate report.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Lemon Shield backend running on port ${PORT}`);
});
