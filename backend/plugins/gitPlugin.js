const gitP = require("simple-git");

class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class GitPlugin {
  constructor(repoPath) {
    this.git = gitP(repoPath);
  }

  async clone({ repoUrl }) {
    try {
      await this.git.clone(repoUrl);
      return { success: true };
    } catch (error) {
      throw new CustomError("Failed to clone repository", 400);
    }
  }

  async pull({ remote = "origin", branch = "master" }) {
    try {
      await this.git.pull(remote, branch);
      return { success: true };
    } catch (error) {
      throw new CustomError("Failed to pull from repository", 400);
    }
  }

  async add({ filePattern = "." }) {
    try {
      await this.git.add(filePattern);
      return { success: true };
    } catch (error) {
      throw new CustomError("Failed to add changes", 400);
    }
  }

  async commit({ message }) {
    try {
      await this.git.commit(message);
      return { success: true };
    } catch (error) {
      throw new CustomError("Failed to commit changes", 400);
    }
  }

  async push({ remote = "origin", branch = "master" }) {
    try {
      await this.git.push(remote, branch);
      return { success: true };
    } catch (error) {
      throw new CustomError("Failed to push changes", 400);
    }
  }
  async status() {
    try {
      const statusSummary = await this.git.status();
      return { success: true, summary: statusSummary };
    } catch (error) {
      throw new CustomError("Failed to retrieve status: " + error.message, 400);
    }
  }

  async merge({ from }) {
    try {
      const mergeSummary = await this.git.merge([from]);
      if (mergeSummary.failed) {
        throw new CustomError("Merge conflict occurred.", 400);
      }
      return { success: true, summary: mergeSummary };
    } catch (error) {
      throw new CustomError("Failed to merge branch: " + error.message, 400);
    }
  }
}

module.exports = GitPlugin;
