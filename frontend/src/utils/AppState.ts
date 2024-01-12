import { Signal, signal } from "@preact/signals";
import { Location } from "react-router-dom";
import { App, Component } from "../types/types";

// Define types for your component and app state here
export default class AppState {
  private app: any;
  private location: any;
  private componentCache: { [key: string]: Signal<Component> };
  getCustomView(name: string) {
    return this.app.customViews[name];
  }
  getApp() {
    return this.app;
  }
  setState(app: App, location: Location) {
    this.app = app;
    this.location = location;
  }
  constructor(app: App, location: Location) {
    this.setState(app, location);
    this.componentCache = {};
  }

  /**
   * Sets a component by name.
   * @param {object} component - The component to set.
   */
  setComponentSignal(component: Component) {
    if (this.componentCache[component.name])
      alert("Component already exists: " + component.name);
    else this.componentCache[component.name] = signal(component);
    return this.componentCache[component.name];
  }

  /**
   * Gets a component by name.
   * @param {string} name - The name of the component to get.
   */

  getComponentSignal(name: string): Signal<Component> | undefined {
    return this.componentCache[name];
  }
  getComponent(name: string): Component | undefined {
    return this.componentCache[name]?.value;
  }
  /**
   * Updates a component's properties by name.
   * @param {string} componentName - The name of the component to update.
   * @param {object} newProperties - The new properties to set on the component.
   */
  changeComponent(componentName: string, newProperties: any) {
    const componentSignal = this.getComponentSignal(componentName);
    if (componentSignal) {
      // Update the component's properties
      componentSignal.value = {
        ...componentSignal.value,
        properties: {
          ...componentSignal.value.properties,
          ...newProperties,
        },
      };

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
  ): Component | undefined {
    // Generate a unique cache key for the custom view instance
    const cacheKey = `${customViewName}_${index}`;
    // Check if the custom view instance is already in the cache
    if (this.componentCache[cacheKey]) {
      return this.componentCache[cacheKey].value;
    }

    const customViewTemplate = this.app.customViews[customViewName];
    if (!customViewTemplate) {
      console.error(`Custom view "${customViewName}" not found.`);
      return;
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
    // this.componentCache[customViewClone.name] = signal(customViewClone);
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
