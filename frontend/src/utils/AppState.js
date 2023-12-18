// utils/AppState.js
export class AppState {
  setState(app, setAppState, location) {
    this.app = app;
    this.location = location;
    this.setAppState = setAppState;
  }
  constructor(app, setAppState, location) {
    this.setState(app, setAppState, location);
    this.customViewCache = {}; // New cache to store custom view instances
  }

  getComponent(name) {
    // First, search in the main app structure
    let foundComponent = this._searchComponentByName(name, this.app);

    // If not found in the main app, search in the customViewCache
    if (!foundComponent) {
      Object.values(this.customViewCache).forEach((cacheItem) => {
        const componentInCache = this._searchComponentByName(name, cacheItem);
        if (componentInCache) {
          foundComponent = componentInCache;
          return;
        }
      });
    }

    return foundComponent;
  }
  _searchComponentByName(name, currentComponent) {
    if (!currentComponent || typeof currentComponent !== "object") return null;

    // Base case: if the component's name matches, return the component
    if (currentComponent.name === name) {
      return currentComponent;
    }

    // Recursive case: iterate over all properties
    for (const key in currentComponent) {
      const prop = currentComponent[key];

      // If the property is an object or an array, search recursively
      if (prop && typeof prop === "object") {
        let foundComponent;

        if (Array.isArray(prop)) {
          for (const item of prop) {
            foundComponent = this._searchComponentByName(name, item);
            if (foundComponent) return foundComponent;
          }
        } else {
          foundComponent = this._searchComponentByName(name, prop);
          if (foundComponent) return foundComponent;
        }
      }
    }

    return null;
  }
  /**
   * Updates a component's properties by name.
   * @param {string} componentName - The name of the component to update.
   * @param {object} newProperties - The new properties to set on the component.
   */
  changeComponent(componentName, newProperties) {
    const component = this.getComponent(componentName);
    if (component) {
      // Update the component's properties
      component.properties = { ...component.properties, ...newProperties };

      // Optionally, you can trigger a state update or any other necessary updates
      this.setAppState({ ...this.app }); // if setAppState is a method to trigger React state update

      return true;
    } else {
      console.error(`Component "${componentName}" not found in AppState.`);
      return false;
    }
  }

  getCustomViewWithItemData(customViewName, dataItem, index) {
    // Generate a unique cache key for the custom view instance
    const cacheKey = `${customViewName}_${index}`;
    // Check if the custom view instance is already in the cache
    if (this.customViewCache[cacheKey]) {
      return this.customViewCache[cacheKey];
    }

    const customViewTemplate = this.app.customViews[customViewName];
    if (!customViewTemplate) {
      console.error(`Custom view "${customViewName}" not found.`);
      return null;
    }

    const customViewClone = structuredClone(customViewTemplate);

    // Attach the dataItem and update names with index
    customViewClone.properties = {
      ...customViewClone.properties,
      dataItem: dataItem,
      dataIndex: index,
    };

    this._appendIndexToNames(customViewClone, index);

    // Store the new custom view instance in the cache
    this.customViewCache[cacheKey] = customViewClone;

    return customViewClone;
  }

  /**
   * Appends an index to the names of all components.
   * @param {object} component - The component or sub-component to process.
   * @param {number|string} index - The index to append.
   */
  _appendIndexToNames(component, index) {
    // Check if the component is valid and has 'name' and 'type' properties
    if (component && typeof component === "object") {
      if (component.name && component.type) component.name += `_${index}`;

      // Iterate over all properties for nested objects or arrays
      for (const key in component) {
        const prop = component[key];
        if (prop && typeof prop === "object") {
          if (Array.isArray(prop)) {
            prop.forEach((item) => this._appendIndexToNames(item, index));
          } else {
            this._appendIndexToNames(prop, index);
          }
        }
      }
    }
  }
}
