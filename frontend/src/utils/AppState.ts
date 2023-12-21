// utils/AppState.ts

import { Location } from "react-router-dom";
import { App, Component } from "../types/types";

// Define types for your component and app state here
export default class AppState {
  private app: any;
  private location: any;
  private setAppState: (app: App) => void;
  private customViewCache: { [key: string]: any };
  private componentCache: { [key: string]: Component };
  getCustomView(name: string) {
    return this.app.customViews[name];
  }
  getApp() {
    return this.app;
  }
  setState(app: App, setAppState: (app: App) => void, location: Location) {
    this.app = app;
    this.location = location;
    this.setAppState = setAppState;
  }
  constructor(app: App, setAppState: (app: App) => void, location: Location) {
    this.setState(app, setAppState, location);
    this.customViewCache = {};
    this.componentCache = {};
  }

  getComponent(name: string): Component | null {
    // Check if the component is already in the cache
    if (this.componentCache[name]) {
      return this.componentCache[name];
    }
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

    // Cache the component for future use
    if (foundComponent) this.componentCache[name] = foundComponent;
    return foundComponent;
  }
  _searchComponentByName(
    name: string,
    currentComponent: any
  ): Component | null {
    if (!currentComponent || typeof currentComponent !== "object") return null;

    // Base case: if the component's name matches, return the component
    if (currentComponent.name === name) {
      return currentComponent;
    }

    const skipKeys = ["dataSource", "current"];
    // Recursive case: iterate over all properties
    for (const key in currentComponent) {
      if (skipKeys.includes(key)) continue;
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
  changeComponent(componentName: string, newProperties: any) {
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

  getCustomViewWithItemData(
    customViewName: string,
    dataItem: any,
    index: number
  ) {
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
  _appendIndexToNames(component: any, index: number) {
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
