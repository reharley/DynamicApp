export function buildSchema(data) {
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
