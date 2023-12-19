// plugins/fileSystemPlugin.js
const fs = require("fs");
const path = require("path");

class FileSystemPlugin {
  constructor(basePath) {
    this.basePath = basePath;
  }

  readDirectory(dirPath) {
    const fullPath = path.join(this.basePath, dirPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Directory not found: ${fullPath}`);
    }

    const directoryContents = fs.readdirSync(fullPath, { withFileTypes: true });
    return directoryContents.map((dirent) => {
      if (dirent.isDirectory()) {
        return {
          name: dirent.name,
          type: "directory",
          children: this.readDirectory(path.join(dirPath, dirent.name)),
        };
      } else {
        return { name: dirent.name, type: "file" };
      }
    });
  }

  getFolderStructure(folderPath = "") {
    return this.readDirectory(folderPath);
  }
  createDirectory(dirPath) {
    const fullPath = path.join(this.basePath, dirPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    } else {
      throw new Error(`Directory already exists: ${fullPath}`);
    }
  }
  createFile(filePath, content) {
    const fullPath = path.join(this.basePath, filePath);
    if (fs.existsSync(fullPath)) {
      throw new Error(`File already exists: ${fullPath}`);
    }
    fs.writeFileSync(fullPath, content);
  }
  readFile(filePath) {
    const fullPath = path.join(this.basePath, filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    return fs.readFileSync(fullPath, "utf8");
  }
  updateFile(filePath, content, overwrite = false) {
    const fullPath = path.join(this.basePath, filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    if (overwrite) {
      fs.writeFileSync(fullPath, content);
    } else {
      fs.appendFileSync(fullPath, content);
    }
  }
  deleteDirectory(dirPath, recursive = true) {
    const fullPath = path.join(this.basePath, dirPath);
    if (fs.existsSync(fullPath)) {
      fs.rmdirSync(fullPath, { recursive });
    } else {
      throw new Error(`Directory not found: ${fullPath}`);
    }
  }
  deleteFile(filePath) {
    const fullPath = path.join(this.basePath, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    } else {
      throw new Error(`File not found: ${fullPath}`);
    }
  }
}
module.exports = FileSystemPlugin;
