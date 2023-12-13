// utils/AppState.js
export class AppState {
  constructor(app, setAppState) {
    this.app = app;
    this.setAppState = setAppState;
    this.componentInstances = {};
  }
  setState(app, setAppState) {
    this.app = app;
    this.setAppState = setAppState;
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

    // Check in customViews if not found in regular structure
    if (!component && this.app.customViews) {
      component = this._findComponent(this.app.customViews, componentName);
    }

    if (
      component &&
      component.type === "Form" &&
      this.formInstances?.[componentName]
    ) {
      component.formInstance = this.formInstances[componentName];
    }

    return component;
  }

  _findComponent(obj, name) {
    if (obj.name === name) return obj;
    const children = obj.children || obj.items;
    if (children) {
      for (const child of obj.children) {
        const found = this._findComponent(child, name);
        if (found) return found;
      }
    }
    return null;
  }
}
