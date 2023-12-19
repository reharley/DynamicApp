Build unit tests in appFunction.test.js for appFunctions.js given the function description and the use case in the app.json.

```javascript
// appFunctions.js

/**
 * Initializes the main menu by setting the selected key based on the current route.
 * @param {AppState} appState - The state of the application.
 * @param {Component} component - The component that triggered the event.
 */
export function initMainMenu(appState, component) {
  // Retrieve the mainMenu component from the app state
  const mainMenu = appState.getComponent(component.name);
  // Check if the mainMenu component is found
  if (!mainMenu) {
    console.error("MainMenu component not found.");
    return;
  }

  // Get the current location's pathname
  const currentPath = appState.location.pathname;
  // Derive the selected key based on the current route
  const selectedKey = mainMenu.items.find(
    (item) => item.properties.link === currentPath
  )?.properties.key;

  // If a selected key is found, update the mainMenu component
  if (selectedKey) {
    appState.changeComponent(component.name, { selectedKeys: [selectedKey] });
  }
}
```

```javascript
// utils/AppState.js
export class AppState {
  setState(app, setAppState, location) {
    this.app = app;
    this.location = location;
    this.setAppState = setAppState;
  }
  constructor(app, setAppState, location) {
    this.setState(app, setAppState, location);
    this.componentInstances = {};
  }
  setComponentInstance(componentName, componentInstance) {
    this.componentInstances[componentName] = componentInstance;
  }

  getComponentInstance(componentName) {
    return this.componentInstances?.[componentName];
  }

  changeComponent(componentName, newProperties) {
    this.setAppState((prevApp) => {
      const updatedApp = { ...prevApp };
      this._updateComponent(updatedApp, componentName, newProperties);
      this._updateCustomViewComponent(
        updatedApp.customViews,
        componentName,
        newProperties
      );
      return updatedApp;
    });
  }

  _updateComponent(obj, componentName, newProperties) {
    if (obj.name === componentName) {
      obj.properties = { ...obj.properties, ...newProperties };
      return true;
    }

    if (obj.children) {
      obj.children.forEach((child) => {
        this._updateComponent(child, componentName, newProperties);
      });
    }
  }

  _updateCustomViewComponent(customViews, componentName, newProperties) {
    Object.values(customViews).forEach((view) => {
      this._updateComponent(view, componentName, newProperties);
    });
  }

  getComponent(componentName) {
    let component = this._findComponent(this.app, componentName);
    if (!component) {
      // Search in custom views
      const customViewComponent = this._findComponentInCustomViews(
        this.app.customViews,
        componentName
      );
      if (customViewComponent) {
        component = customViewComponent;
      }
    }
    component.componentInstance = this.getComponentInstance(componentName);
    if (component.type === "Form" && component.componentInstance) {
      component.formInstance = component.componentInstance;
    }
    return component;
  }
  _findComponentInCustomViews(customViews, name) {
    for (const viewKey in customViews) {
      const found = this._findComponent(customViews[viewKey], name);
      if (found) return found;
    }
    return null;
  }
  _findComponent(obj, name) {
    if (obj.name === name) return obj;
    const children = obj.children || obj.items;
    if (children) {
      for (const child of children) {
        const found = this._findComponent(child, name);
        if (found) return found;
      }
    }
    return null;
  }
}
```

sample component:

```json
{
  "type": "Menu",
  "name": "mainMenu",
  "properties": {
    "theme": "dark",
    "mode": "horizontal",
    "defaultSelectedKeys": ["Browse"]
  },
  "onInit": "initMainMenu",
  "items": [
    {
      "type": "MenuItem",
      "name": "browseBooks",
      "properties": {
        "key": "Browse",
        "link": "/browse"
      },
      "text": "Browse Books"
    },
    {
      "type": "MenuItem",
      "name": "userProfile",
      "properties": {
        "key": "Profile",
        "link": "/profile"
      },
      "text": "My Profile"
    },
    {
      "type": "MenuItem",
      "name": "adminPanel",
      "properties": {
        "key": "Admin",
        "link": "/admin"
      },
      "text": "Admin Panel"
    }
  ]
}
```
