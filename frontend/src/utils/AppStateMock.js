// MockAppState.js
export class MockAppState {
  constructor(app, location) {
    this.app = app;
    this.location = location;
    this.componentInstances = {};
  }

  setComponentInstance(componentName, componentInstance) {
    this.componentInstances[componentName] = componentInstance;
  }

  getComponentInstance(componentName) {
    return this.componentInstances?.[componentName];
  }

  changeComponent(componentName, newProperties) {
    // Simulate changing the component properties without setState
    const component = this.getComponent(componentName);
    if (component) {
      component.properties = { ...component.properties, ...newProperties };
    }
  }

  getComponent(componentName) {
    return this._findComponent(this.app, componentName);
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
