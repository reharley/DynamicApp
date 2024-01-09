const fs = require("fs");
const path = require("path");

const skipFiles = ["node_modules", ".git"];
class FileSystemPlugin {
  constructor(basePath) {
    this.basePath = basePath;
  }

  getFilesContent({ filePaths }) {
    try {
      return filePaths.map((filePath) => {
        const fullPath = path.resolve(this.basePath, filePath);
        const content = fs.readFileSync(fullPath, "utf-8");
        const fileType = path.extname(filePath).slice(1); // Get file extension as type
        const fileName = path.basename(filePath);

        return {
          path: filePath,
          name: fileName,
          type: fileType,
          content: content,
        };
      });
    } catch (error) {
      throw new Error("Error reading file contents: " + error.message);
    }
  }

  readDirectory({ dirPath }) {
    const fullPath = path.join(this.basePath, dirPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Directory not found: ${fullPath}`);
    }

    const directoryContents = fs.readdirSync(fullPath, { withFileTypes: true });
    return directoryContents.map((dirent) => {
      if (
        dirent.isDirectory() &&
        !dirent.name.startsWith(".") &&
        skipFiles.indexOf(dirent.name) === -1
      ) {
        return {
          name: dirent.name,
          type: "directory",
          children: this.readDirectory({
            dirPath: path.join(dirPath, dirent.name),
          }),
        };
      } else {
        return { name: dirent.name, type: "file" };
      }
    });
  }

  getFolderStructure({ dirPath = "" }) {
    return this.readDirectory({ dirPath });
  }
  createDirectory({ dirPath }) {
    const fullPath = path.join(this.basePath, dirPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    } else {
      throw new Error(`Directory already exists: ${fullPath}`);
    }
  }
  createFile({ filePath, content }) {
    const fullPath = path.join(this.basePath, filePath);
    if (fs.existsSync(fullPath)) {
      throw new Error(`File already exists: ${fullPath}`);
    }
    fs.writeFileSync(fullPath, content);
  }
  readFile({ filePath }) {
    const fullPath = path.join(this.basePath, filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    return fs.readFileSync(fullPath, "utf8");
  }
  updateFile({ filePath, content, overwrite = false }) {
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
  deleteDirectory({ dirPath, recursive = true }) {
    const fullPath = path.join(this.basePath, dirPath);
    if (fs.existsSync(fullPath)) {
      fs.rmdirSync(fullPath, { recursive });
    } else {
      throw new Error(`Directory not found: ${fullPath}`);
    }
  }
  deleteFile({ filePath }) {
    const fullPath = path.join(this.basePath, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    } else {
      throw new Error(`File not found: ${fullPath}`);
    }
  }
  insertString({ filePath, content, start, end }) {
    const fullPath = path.join(this.basePath, filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }

    const fileContent = fs.readFileSync(fullPath, "utf8");
    const lines = fileContent.split("\n");
    const startIndex = lines.findIndex((line) => line.includes(start));
    const endIndex = lines.findIndex((line) => line.includes(end));

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("Start or end line not found");
    }

    if (startIndex >= endIndex) {
      throw new Error("End line comes before start line");
    }

    const newContent = [
      ...lines.slice(0, startIndex + 1),
      content,
      ...lines.slice(endIndex),
    ].join("\n");

    fs.writeFileSync(fullPath, newContent);
  }

  replaceString({ filePath, replacementContent, pattern }) {
    const fullPath = path.join(this.basePath, filePath);

    if (!fs.existsSync(fullPath)) {
      return `File not found: ${fullPath}`;
    }

    let fileContent = fs.readFileSync(fullPath, "utf8");

    // Create a regex object from the pattern
    const regex = new RegExp(pattern, "g");

    // Replace the content matched by the regex pattern
    const newContent = fileContent.replace(regex, replacementContent);

    fs.writeFileSync(fullPath, newContent);
    return { success: true };
  }
}
module.exports = FileSystemPlugin;
