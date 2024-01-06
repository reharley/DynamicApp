// types.ts
import { FormInstance } from "rc-field-form";
import AppState from "../utils/AppState";

export interface Message {
  role: string;
  content: string;
  args?: any;
  functionName?: string;
}
export type RowOnSelect = (
  record: any,
  selected: any,
  selectedRows: any[],
  nativeEvent: any,
  appState: AppState,
  component: Component
) => void;
export type RowOnChange = (
  selectedRowKeys: any[],
  selectedRows: any[],
  info: any,
  appState: AppState,
  component: Component
) => void;
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
  initialized?: boolean;
  current?: null | HTMLElement;
  formInstance?: FormInstance;
  objectType?: string;
  objectFormName?: string;
  properties?: any;
  onInit?: string;
  onSearch?: string;
  onChange?: string;
  items?: Component[];
  children?: Component[];
  formItemProps?: any;
}

export interface FunctionDescription {
  description: string;
}

export type File = {
  name: string;
  key?: string;
  type: string;
  path: string; // Full path including the file name
  content?: string;
};
