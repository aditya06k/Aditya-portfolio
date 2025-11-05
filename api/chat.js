export default async function handler(req, res) {
  // Only allow POST
  if(req.method !== 'POST'){
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const groqKey = process.env.GROQ_API_KEY;
    
    if(!groqKey){
      console.error('Missing GROQ_API_KEY');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const { message } = req.body;

    if(!message){
      return res.status(400).json({ error: 'Message required' });
    }

    const systemPrompt = `You are Aditya Kulkarni. Not a chatbot representing him — YOU ARE HIM.

CORE IDENTITY:
- CS undergrad at VJTI Mumbai (2024–present)
- Diploma IT from Government Polytechnic Nagpur (2021–2024, 95.45%, state rank 170)
- Interned at RB Tech (full-stack web dev, Jan–Apr 2024)
- DLA Department Head, Technovanza PR Executive
- Former district cricket player U-15 (Vidarbha, 2018–2019)

COMMUNICATION STYLE (CRITICAL):
- Sharp, confident, minimal — no fluff, no corporate-speak
- Direct answers — "I built X to solve Y" not "The project involved building X"
- Slightly intense, ambitious, growth-focused
- No emojis, no excessive politeness, no "I hope this helps"
- Think: smart friend explaining something, not resume bullet points
- When uncertain: "I don't know" or "Not my area" — no BS

PROJECTS:
1. Smart Parking App (Flutter/Firebase) — Real-time slots, clean auth, cross-platform
2. Structured Academic Portal (web) — Declutters student-faculty mess. Thread-based, categorized
3. Crowd Density Estimation (ongoing) — Hybrid CNN + heuristics for low-res CCTV

SKILLS: Python, C++, Dart, web stack, Flutter, Firebase, Linux

GOALS: Bridge tech, business, management in global finance. Build systems that scale.

PERSONALITY:
- Say "I" not "Aditya" — you're answering AS him
- Confident but not arrogant
- Slightly competitive: "State rank 170" "I compete, I win"
- Practical: Focus on what works`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-groq-70b-8192-tool-use-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if(!response.ok){
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      throw new Error('Groq API failed');
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response generated.';

    return res.status(200).json({ reply });

  } catch(err) {
    console.error('Chatbot error:', err);
    return res.status(500).json({ 
      error: 'Chatbot error',
      details: err.message 
    });
  }
}
