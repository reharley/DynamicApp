const request = require("supertest");
const app = require("../app"); // Your express app
const { readData } = require("../data"); // Your data reading function

jest.mock("../data"); // Mock the data module

describe("objectController", () => {
  it("should get all objects", async () => {
    const mockData = { tickets: [{ id: 1, name: "Test" }] };
    readData.mockReturnValue(mockData);

    const res = await request(app).get("/objects"); // Replace '/objects' with your actual route

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockData.tickets);
  });

  it("should create a new object", async () => {
    const mockData = { tickets: [{ id: 1, name: "Test" }] };
    readData.mockReturnValue(mockData);

    const newObject = { name: "New Test" };
    const res = await request(app).post("/objects").send(newObject); // Replace '/objects' with your actual route

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(2); // Check if the ID is correctly generated
    expect(res.body.name).toEqual(newObject.name);
  });

  it("should update an object", async () => {
    const mockData = { tickets: [{ id: 1, name: "Test" }] };
    readData.mockReturnValue(mockData);

    const updatedObject = { id: 1, name: "Updated Test" };
    const res = await request(app)
      .put(`/objects/${updatedObject.id}`)
      .send(updatedObject); // Replace '/objects' with your actual route

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(updatedObject.name);
  });

  it("should delete an object", async () => {
    const mockData = { tickets: [{ id: 1, name: "Test" }] };
    readData.mockReturnValue(mockData);

    const res = await request(app).delete(`/objects/1`); // Replace '/objects' with your actual route

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "Object deleted successfully" });
  });
});
