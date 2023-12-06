const fs = require("fs");

// Function to read JSON data from a file
function readJsonFile(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    process.exit(1);
  }
}

// Function to recursively build a schema from the JSON data
function buildSchema(data) {
  let schema = {};

  if (Array.isArray(data)) {
    schema.type = "array";
    schema.items = data.length > 0 ? buildSchema(data[0]) : {};
  } else if (typeof data === "object" && data !== null) {
    schema.type = "object";
    schema.properties = {};
    Object.keys(data).forEach((key) => {
      schema.properties[key] = buildSchema(data[key]);
    });
  } else {
    schema.type = typeof data;
  }

  return schema;
}

// Function to write the schema to a file
function writeSchemaToFile(schema, outputPath) {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
    console.log("Schema file created successfully.");
  } catch (error) {
    console.error("Error writing schema file:", error);
  }
}

// Main function
function main() {
  const inputFilePath = "./service_desk_dummy_data.json"; // Replace with your JSON file path
  const outputFilePath = "./output-schema.json"; // Replace with desired output path

  const jsonData = readJsonFile(inputFilePath);
  const schema = buildSchema(jsonData);
  writeSchemaToFile(schema, outputFilePath);
}

main();
