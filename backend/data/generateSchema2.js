const fs = require("fs");

// Function to read JSON data from a file
function readJsonFile(filePath) {
  try {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    process.exit(1);
  }
}

// Function to recursively build TypeScript definitions from the JSON data
function buildTypeScriptDefinition(data, interfaceName = "RootObject") {
  let tsDef = `interface ${interfaceName} {\n`;

  if (Array.isArray(data)) {
    const itemType =
      typeof data[0] === "object" ? `${interfaceName}Item` : typeof data[0];
    tsDef += `  items: ${itemType}[];\n`;
    if (typeof data[0] === "object") {
      tsDef += buildTypeScriptDefinition(data[0], `${interfaceName}Item`);
    }
  } else if (typeof data === "object" && data !== null) {
    Object.keys(data).forEach((key) => {
      const keyType = typeof data[key];
      if (keyType === "object") {
        tsDef += `  ${key}: ${interfaceName}${capitalizeFirstLetter(key)};\n`;
        tsDef += buildTypeScriptDefinition(
          data[key],
          `${interfaceName}${capitalizeFirstLetter(key)}`
        );
      } else {
        tsDef += `  ${key}: ${keyType};\n`;
      }
    });
  }
  tsDef += "}\n";

  return tsDef;
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to write TypeScript definitions to a file
function writeTypeScriptDefinitions(tsDef, outputPath) {
  try {
    fs.writeFileSync(outputPath, tsDef);
    console.log("TypeScript definition file created successfully.");
  } catch (error) {
    console.error("Error writing TypeScript definition file:", error);
  }
}

// Main function
function main() {
  const inputFilePath = "./service_desk_dummy_data.json"; // Replace with your JSON file path
  const outputFilePath = "./output-schema2.ts"; // Replace with desired output path

  const jsonData = readJsonFile(inputFilePath);
  const tsDefinitions = buildTypeScriptDefinition(jsonData);
  writeTypeScriptDefinitions(tsDefinitions, outputFilePath);
}

main();
