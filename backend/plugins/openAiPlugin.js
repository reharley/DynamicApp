// openAiPlugin.js
const OpenAI = require("openai");

class OpenAIPlugin {
  constructor() {
    // Initialize OpenAI API with your API key
    this.openai = new OpenAI();
  }

  async chat(req, res) {
    const { messages } = req.body.data;
    if (!messages) {
      return res.status(400).json({ message: "Messages is required" });
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages,
      });

      messages.push({
        role: "assistant",
        content: completion.choices[0].message.content,
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = OpenAIPlugin;
