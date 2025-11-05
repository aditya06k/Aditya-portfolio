export default async function handler(req, res) {
  try {
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return res.status(500).json({ error: "Missing Groq API Key" });
    }

    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-groq-70b-8192-tool-use-preview",
        messages: [
          { role: "system", content: "You are Aditya's portfolio chatbot. Answer confidently, sharply, and only about portfolio / skills / projects." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Chatbot Error" });
  }
}
