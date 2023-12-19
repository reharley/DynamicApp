import { initMainMenu } from "../appFunctions";

describe("initMainMenu", () => {
  let appState;
  let mainMenuComponent;

  beforeEach(() => {
    mainMenuComponent = {
      name: "mainMenu",
      items: [{ properties: { link: "/browse", key: "Browse" } }],
      selectedKeys: [],
    };

    appState = {
      getComponent: jest.fn().mockReturnValue(mainMenuComponent),
      changeComponent: jest.fn(),
      location: { pathname: "" },
    };
  });

  test("Valid Route - updates selected key", () => {
    appState.location.pathname = "/browse";

    initMainMenu(appState, mainMenuComponent);

    expect(appState.getComponent).toHaveBeenCalledWith("mainMenu");
    expect(appState.changeComponent).toHaveBeenCalledWith("mainMenu", {
      selectedKeys: ["Browse"],
    });
  });

  test("Invalid Route - no change in selected key", () => {
    appState.location.pathname = "/invalid-route";

    initMainMenu(appState, mainMenuComponent);

    expect(appState.getComponent).toHaveBeenCalledWith("mainMenu");
    expect(appState.changeComponent).not.toHaveBeenCalledWith("mainMenu", {
      selectedKeys: ["Browse"],
    });
  });

  test("MainMenu Component Missing - error handling", () => {
    appState.getComponent.mockReturnValueOnce(null);

    expect(() => initMainMenu(appState, mainMenuComponent)).toThrowError();
  });
});
