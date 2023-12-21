const MockDatabasePlugin = require("./mockDatabasePlugin");
const SQLDatabasePlugin = require("./sqlDatabasePlugin");
const OpenAIPlugin = require("./openAiPlugin");
const FileSystemPlugin = require("./fsPlugin");
const GitPlugin = require("./gitPlugin");
// const remoteRepoUrl = "../../Dynamic_App";
const remoteRepoUrl = "../";
// Initialize plugins
const plugins = {
  mock: new MockDatabasePlugin(),
  sql: new SQLDatabasePlugin(),
  openai: new OpenAIPlugin(),
  fs: new FileSystemPlugin(remoteRepoUrl),
  git: new GitPlugin(remoteRepoUrl),
};
module.exports = plugins;
