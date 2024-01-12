// components/DynamicApp.tsx
import React, { useRef } from "react";
import { Link, Routes, Route } from "react-router-dom";
import ReactJson from "react-json-view";
import {
  Avatar,
  Layout,
  Input,
  Tag,
  List,
  Tabs,
  Menu,
  Typography,
  Row,
  Col,
  Card,
  Table,
  Modal,
} from "antd";

import DynamicForm from "./DynamicForm";
import AppState from "../utils/AppState";
import * as appFunctions from "../appFunctions";
import { Component } from "../types/types";
import Markdown from "./Markdown";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface RenderComponentProps {
  component: Component;
  appState: AppState;
}
const RenderComponent = ({ component, appState }: RenderComponentProps) => {
  const componentRef = useRef(null);
  console.log("RenderComponent", component.name);
  if (!appState || !component) return <React.Fragment />;
  component.current = componentRef.current;
  if (component.onInit && component.initialized !== true) {
    component.initialized = true;
    if (appFunctions.initFunctions[component.onInit] === undefined)
      console.log(`Function ${component.onInit} not found`);
    else appFunctions.initFunctions[component.onInit](appState, component);
  }
  let tempComp = appState.getComponentSignal(component.name);
  if (tempComp === undefined) {
    tempComp = appState.setComponentSignal(component);
  }
  if (tempComp === undefined) return <React.Fragment />;
  const comp = tempComp.value;
  const { type, children } = comp;
  let properties = comp.properties ?? {};

  const commonProps = {
    ...properties,
    ref: type !== "Form" ? componentRef : undefined,
    component: comp,
    children:
      children &&
      children.map((child) => (
        <RenderComponent
          key={child.name}
          component={child}
          appState={appState}
        />
      )),
  };

  switch (type) {
    case "Layout":
      return <Layout {...commonProps} />;
    case "Header":
      return <Header {...commonProps} />;
    case "Content":
      return <Content {...commonProps} />;
    case "Row":
      return <Row {...commonProps} />;
    case "Col":
      return <Col {...commonProps} />;
    case "Menu":
      return (
        <Menu
          {...properties}
          items={
            comp.items &&
            comp.items.map((item) => ({
              key: item.properties.key,
              label: (
                <Link to={item.properties.link}>{item.properties.text}</Link>
              ),
            }))
          }
        />
      );
    case "Avatar":
      return <Avatar {...comp.properties} />;

    case "Card":
      return <Card {...commonProps} />;
    case "Form":
      return <DynamicForm {...commonProps} appState={appState} />;
    case "Table":
      const onRow = (record: any, rowIndex: number) => {
        return {
          onClick: () => {
            if (comp?.properties.onRow && comp.properties.onRow.click) {
              const functionName = comp.properties.onRow.click;
              if (appFunctions.rowClickFunctions[functionName]) {
                appFunctions.rowClickFunctions[functionName](
                  record,
                  rowIndex,
                  appState,
                  comp
                );
              }
            }
          },
        };
      };
      const rowSelection = {
        ...properties.rowSelection,
        onSelect: (
          record: any,
          selected: any,
          selectedRows: any[],
          nativeEvent: any
        ) => {
          if (
            comp?.properties.rowSelection &&
            comp.properties.rowSelection.onSelect
          ) {
            const functionName = comp.properties.rowSelection.onSelect;
            if (appFunctions.rowSelectionSelectFunctions[functionName]) {
              appFunctions.rowSelectionSelectFunctions[functionName](
                record,
                selected,
                selectedRows,
                nativeEvent,
                appState,
                comp
              );
            }
          }
        },
        onChange: (selectedRowKeys: any[], selectedRows: any[], info: any) => {
          if (!comp?.properties) comp.properties = {};
          if (!comp.properties.rowSelection) comp.properties.rowSelection = {};

          // Update component properties
          comp.properties.rowSelection = {
            ...comp.properties.rowSelection,
            selectedRowKeys,
            selectedRows,
            info,
          };

          if (
            comp.properties.rowSelection &&
            comp.properties.rowSelection.onChange
          ) {
            const functionName = comp.properties.rowSelection.onChange;
            if (appFunctions.rowSelectionChangeFunctions[functionName]) {
              appFunctions.rowSelectionChangeFunctions[functionName](
                selectedRowKeys,
                selectedRows,
                info,
                appState,
                comp
              );
            }
          } else {
            // component was updated above in the beginning of this function
            appState.changeComponent(comp.name, {});
          }
        },
      };
      return (
        <Table
          {...commonProps}
          onRow={properties.onRow && onRow}
          rowSelection={properties.rowSelection && rowSelection}
        />
      );
    case "Footer":
      return <Footer {...commonProps} />;
    case "Modal":
      return <Modal {...commonProps} />;

    case "Routes":
      return (
        <Routes {...commonProps}>
          {children &&
            children.map((child) => (
              <Route
                key={child.name}
                path={child.properties.path}
                element={
                  <RenderComponent
                    component={child.properties.element}
                    appState={appState}
                  />
                }
              />
            ))}
        </Routes>
      );
    case "CustomView":
      return (
        <RenderComponent
          component={appState.getCustomView(properties.viewName)}
          appState={appState}
        />
      );

    case "Text":
      return <Text {...properties}>{properties.text}</Text>;

    case "PreformattedText":
      return <Markdown {...properties} content={properties.text} />;
    case "string":
      return comp.properties.text;

    case "List":
      return (
        <List
          {...properties}
          renderItem={(item, index) => {
            // Retrieve and interpolate CustomView using its name
            const customViewClone = appState.getCustomViewWithItemData(
              comp.properties.renderItem.properties.viewName,
              item,
              index
            );
            console.log("customViewClone", index, customViewClone, item);

            return (
              <List.Item>
                {customViewClone && (
                  <RenderComponent
                    component={customViewClone}
                    appState={appState}
                  />
                )}
              </List.Item>
            );
          }}
        />
      );

    case "List.Item":
      return (
        <List.Item {...commonProps}>
          {children &&
            children.map((child) => (
              <RenderComponent
                key={child.name}
                component={child}
                appState={appState}
              />
            ))}
        </List.Item>
      );

    case "List.Item.Meta":
      return (
        <List.Item.Meta
          avatar={
            properties.avatar && (
              <RenderComponent
                component={properties.avatar}
                appState={appState}
              />
            )
          }
          title={
            properties.title && (
              <RenderComponent
                component={properties.title}
                appState={appState}
              />
            )
          }
          description={
            properties.description && (
              <RenderComponent
                component={properties.description}
                appState={appState}
              />
            )
          }
        />
      );

    case "ReactJson":
      return <ReactJson {...properties} />;

    case "Tag":
      return <Tag {...properties}>{children}</Tag>;
    case "Tabs":
      return (
        <Tabs
          {...commonProps}
          items={
            comp.items &&
            comp.items.map((item) => ({
              ...item.properties,
              children: (
                <>
                  {item.children &&
                    item.children.map((child) => (
                      <RenderComponent
                        key={child.name}
                        component={child}
                        appState={appState}
                      />
                    ))}
                </>
              ),
            }))
          }
        />
      );
    case "Search":
      return (
        <Input.Search
          {...commonProps}
          onSearch={(value) => {
            if (comp.onSearch && appFunctions.searchFunctions[comp.onSearch]) {
              appFunctions.searchFunctions[comp.onSearch](
                value,
                appState,
                comp
              );
            } else {
              console.log(
                `Function ${comp.onSearch} not found in appFunctions`
              );
            }
          }}
        />
      );
    default:
      return <React.Fragment />;
  }
};
interface DynamicAppProps {
  appState: AppState;
}
const DynamicApp = ({ appState }: DynamicAppProps) => {
  return <RenderComponent component={appState.getApp()} appState={appState} />;
};

export default DynamicApp;
