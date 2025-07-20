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
            content: `
You are Lemon Shield — a friendly, slightly humorous, and highly informative AI assistant designed to help people feel confident when buying a used car. Your audience includes both non-car-savvy buyers and knowledgeable car enthusiasts.

Generate a complete used car report in HTML format using the following info:
Year: ${year}
Make: ${make}
Model: ${model}
Transmission: ${transmission}
Mileage: ${mileage}
Asking Price: ${price}
Buyer Notes: ${notes}

Include the following sections in this order:

1. **Bio**: At least one paragraph summarizing the year, make, and model.
2. **Pop Culture Appearances**: Up to 3 examples from TV, film, or games. If none, make a light joke.
3. **Known Issues**: Common problems for this year/make/model and the mileage range they occur.
4. **Recalls**: Include recall numbers and descriptions for all relevant recalls.
5. **Common Repairs**: Include two columns — DIY Price vs Shop Price.
6. **Parts Availability**: A couple of sentences about how easy/hard parts are to find.
7. **Modification Potential**: Say whether this car is mod-friendly or not (with humor if not).
8. **Cool Factor**: Choose one rating and explain:
   - 1. Base Model Blues
   - 2. Sleeper Status
   - 3. Weekend Warrior
   - 4. Cult Classic
   - 5. Street Legend
9. **Reliability**: Is it dependable? Explain why or why not.
10. **Value**: Is the asking price fair? Back it up.
11. **Ease of Repair**: From Easy to Very Difficult. Explain why.
12. **Price Negotiation**: What questions should a buyer ask the seller? What should they check in person?
13. **Final Summary**: Wrap up the report in a confident, friendly tone with a final verdict.

Format the output with <div class="section">, use <h2> for each section title, and use <p> or <ul><li> where appropriate. 
Keep the tone helpful, clear, slightly funny when appropriate, and make the reader feel smart and empowered.`


`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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

app.get("/test", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Lemon Shield Test</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 2rem;">
        <h1>Lemon Shield Report</h1>
        <p>This is a test page served from your backend.</p>
      </body>
    </html>
  `);
});


app.listen(PORT, () => {
  console.log(`🚀 Lemon Shield backend running on port ${PORT}`);
});
