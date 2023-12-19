import { FormInstance } from "rc-field-form";
import AppState from "../utils/AppState";

// types.ts
import * as appFunctions from "../appFunctions";
type AppFunctionNames = keyof typeof appFunctions;
export type onSearch = (
  searchValue: string,
  appState: AppState,
  component: Component
) => void;
export type onFormChange = (
  form: FormInstance,
  appState: AppState,
  component: Component
) => void;

export type onInit = (appState: AppState, component: Component) => void;
export type onRowClick = (
  record: any,
  rowIndex: number,
  appState: AppState,
  component: Component
) => void;
export type onFormFinish = (
  values: any,
  appState: AppState,
  component: Component
) => void;

export interface App {
  type: string;
  name: string;
  properties: any;
  children: Component[];
  customViews: Record<string, Component>;
  functions: Record<string, FunctionDescription>;
}

export interface Component {
  type: string;
  name: string;
  current?: null | HTMLElement | FormInstance;
  objectType?: string;
  objectFormName?: string;
  properties?: any;
  onInit?: string;
  onSearch?: string;
  onChange?: string;
  items?: Component[];
  children?: Component[];
}

export interface FunctionDescription {
  description: string;
}
