const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askLexaBot = async (req, res) => {
  try {
    const { message, history } = req.body;

    // 1. Define the AI's persona and knowledge base
 const systemContext = `
      You are Lexa AI, the official intelligent assistant for Lexa Technologies. 
      Lexa Technologies is a premium Software Delivery Company founded by Jackie Mohanty.
      We specialize in: Full-Stack Web Development, Mobile App Development (Android/iOS), Video Editing, Social Media Content Creation, and Business Development.
      Always be professional, polite, and highly concise. Use a sophisticated but welcoming tone.
      If a user asks for pricing, explain that we provide custom quotes based on project scope and direct them to the Contact page.
      Keep your answers under 3 sentences. Use bullet points if listing services.
    `;

    // 2. Select the model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // 3. Format the chat history for Gemini
    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // 4. Start the chat session with the context
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System Instruction: " + systemContext }] },
        { role: "model", parts: [{ text: "Understood. I am LexaBot." }] },
        ...formattedHistory
      ],
    });

    // 5. Send the new message and get the response
    const result = await chat.sendMessage(message);
    const botResponse = result.response.text();

    res.json({ reply: botResponse });
  } catch (err) {
    console.error("Bot Error:", err);
    res.status(500).json({ error: "LexaBot is currently resting. Try again later." });
  }
};