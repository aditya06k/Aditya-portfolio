import Groq from "groq-sdk";

export default async function handler(req, res) {
  try {
    const { messages } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY missing" });
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: messages,
      temperature: 0.6,
      max_tokens: 400
    });

    return res.status(200).json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "server_error" });
  }
}
