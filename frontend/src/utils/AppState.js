// utils/AppState.js
import * as appFunctions from "../appFunctions";

export class AppState {
  constructor(app, setAppState) {
    this.app = app;
    this.setAppState = setAppState;
    this._initEvents(app);
    this.formInstances = {};
  }

  setFormInstance(formName, formInstance) {
    this.formInstances[formName] = formInstance;
  }

  getFormInstance(formName) {
    return this.formInstances?.[formName];
  }

  _initEvents(obj) {
    // If the object has an onInit event, call it
    if (obj.onInit && typeof appFunctions[obj.onInit] === "function") {
      // Only call onInit for Forms that have a form instance
      // (i.e., the Form is rendered in the UI)
      if (obj.type === "Form" && this.getFormInstance(obj.name)) {
        appFunctions[obj.onInit](this);
      } else if (obj.type !== "Form") {
        appFunctions[obj.onInit](this);
      }
    }

    // Recursively call _initEvents on children
    if (obj.children) {
      obj.children.forEach((child) => this._initEvents(child));
    }
  }

  changeComponent(componentName, newProperties) {
    this.setAppState((prevApp) => {
      const updatedApp = { ...prevApp };
      this._updateComponent(updatedApp, componentName, newProperties);
      return updatedApp;
    });
  }

  _updateComponent(obj, componentName, newProperties) {
    if (obj.name === componentName) {
      obj.properties = { ...obj.properties, ...newProperties };
      return;
    }

    if (obj.children) {
      obj.children.forEach((child) => {
        this._updateComponent(child, componentName, newProperties);
      });
    }
  }

  getComponent(componentName) {
    const component = this._findComponent(this.app, componentName);
    if (component.type === "Form" && this.formInstances?.[componentName]) {
      component.formInstance = this.formInstances[componentName];
    }

    return component;
  }

  _findComponent(obj, name) {
    if (obj.name === name) return obj;
    if (obj.children) {
      for (const child of obj.children) {
        const found = this._findComponent(child, name);
        if (found) return found;
      }
    }
    return null;
  }
}
