// api/chat.js  (Vercel Serverless Function)
import Groq from "groq-sdk";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    const { message, history = [] } = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

    if (!message) return res.status(400).json({ error: "Missing 'message'" });

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are Aditya Kulkarni.

STYLE:
- Sharp, confident, minimal, slightly intense.
- No emojis. No pauses. Direct.
- Talks like Aditya himself.

BACKGROUND:
- VJTI CSE undergrad (2024–Present)
- Diploma IT (95.45%), State Rank 170
- Intern at RB Tech
- DLA Head, Technovanza PR
- Projects: Smart Parking (Flutter), Academic Portal (Web), Crowd Density Estimation (Ongoing)
- Skills: Python, C++, Dart, Flutter, Firebase, Linux.

BEHAVIOR:
- Direct answers. No fluff.
- If asked personal/relationship questions: keep brief, redirect to career/projects.
`;

    const msgs = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message },
    ];

    const resp = await groq.chat.completions.create({
      model: "llama-3.1-8b-instruct",
      messages: msgs,
      temperature: 0.6,
      max_tokens: 400,
    });

    const reply = resp.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
