// openAiPlugin.js
const OpenAI = require("openai");

class OpenAIPlugin {
  constructor() {
    // Initialize OpenAI API with your API key
    this.openai = new OpenAI();
  }

  async chat({ messages }) {
    if (!messages) {
      throw new Error("Messages is required", { status: 400 });
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
      return messages;
    } catch (error) {
      throw new Error(error.message, { status: 500, cause: error });
    }
  }
}

module.exports = OpenAIPlugin;
