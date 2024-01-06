// openAiPlugin.js
const OpenAI = require("openai");
const MockDatabasePlugin = require("./mockDatabasePlugin");
const FileSystemPlugin = require("./fsPlugin");
const remoteRepoUrl = "../../Dynamic_App";
// Initialize plugins
const plugins = {
  mock: new MockDatabasePlugin(),
  fs: new FileSystemPlugin(remoteRepoUrl),
};

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
      let completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        // model: "gpt-3.5-turbo",
        messages,
        functions: [
          {
            name: "fs-replaceString",
            description:
              "Replaces a string in a file identified by a regular expression",
            parameters: {
              type: "object",
              properties: {
                filePath: {
                  type: "string",
                  description: "The relative path of the file",
                },
                replacementContent: {
                  type: "string",
                  description: "The string to replace the matched content",
                },
                pattern: {
                  type: "string",
                  description:
                    "The regular expression that identifies the snippet to be replaced",
                },
              },
              required: ["filePath", "replacementContent", "pattern"],
            },
          },
        ],
      });
      let maxIterations = 3;
      while (completion.choices[0].message.function_call && maxIterations > 0) {
        maxIterations--;
        console.log(
          "function call",
          completion.choices[0].message.function_call
        );
        let functionName = completion.choices[0].message.function_call.name;
        let args = completion.choices[0].message.function_call.arguments;

        // This assumes you have an object where the keys are pluginNames and the values are plugin instances
        let [pluginName, pluginActionName] = functionName.split("-");
        let plugin = plugins[pluginName];
        let functionResStr;
        if (plugin && typeof plugin[pluginActionName] === "function") {
          try {
            let functionRes = plugin[pluginActionName](JSON.parse(args));
            if (functionRes instanceof Promise)
              functionResStr = JSON.stringify(await functionRes);
            else functionResStr = JSON.stringify(functionRes);
          } catch (e) {
            console.error(e);
            functionResStr = JSON.stringify(e);
          }

          let newMessage = {
            role: "function",
            name: functionName,
            content: functionResStr,
          };

          messages.push(newMessage);

          // Second call
          completion = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages,
          });
        }
      }

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
