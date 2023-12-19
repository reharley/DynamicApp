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

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface RenderComponentProps {
  component: Component;
  appState: AppState;
}
const RenderComponent = ({ component, appState }: RenderComponentProps) => {
  const componentRef = useRef(null);
  if (!appState || !component) return <React.Fragment />;
  component.current = componentRef.current;
  if (componentRef.current === null && component.onInit) {
    if (appFunctions.initFunctions[component.onInit] === undefined)
      console.log(`Function ${component.onInit} not found`);
    else appFunctions.initFunctions[component.onInit](appState, component);
  }
  const { type, children } = component;
  let properties = component.properties ?? {};

  const commonProps = {
    ...properties,
    ref: type !== "Form" ? componentRef : undefined,
    component,
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
            component.items &&
            component.items.map((item) => ({
              key: item.properties.key,
              label: (
                <Link to={item.properties.link}>{item.properties.text}</Link>
              ),
            }))
          }
        />
      );
    case "Avatar":
      return <Avatar {...component.properties} />;

    case "Card":
      return <Card {...commonProps} />;
    case "Form":
      return <DynamicForm {...commonProps} appState={appState} />;
    case "Table":
      const onRow = (record: any, rowIndex: number) => {
        return {
          onClick: () => {
            if (
              component.properties.onRow &&
              component.properties.onRow.click
            ) {
              const functionName = component.properties.onRow.click;
              if (appFunctions.rowClickFunctions[functionName]) {
                appFunctions.rowClickFunctions[functionName](
                  record,
                  rowIndex,
                  appState,
                  component
                );
              }
            }
          },
        };
      };
      return <Table {...commonProps} onRow={onRow} />;
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
      return <pre {...properties}>{properties.text}</pre>;
    case "string":
      return component.properties.text;

    case "List":
      return (
        <List
          {...properties}
          renderItem={(item, index) => {
            // Retrieve and interpolate CustomView using its name
            const customViewClone = appState.getCustomViewWithItemData(
              component.properties.renderItem.properties.viewName,
              item,
              index
            );

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
            component.items &&
            component.items.map((item) => ({
              ...item,
              children: (
                <>
                  {item.children &&
                    item.children.map((child) => {
                      console.log("child", child);
                      return (
                        <RenderComponent
                          key={child.name}
                          component={child}
                          appState={appState}
                        />
                      );
                    })}
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
            if (
              component.onSearch &&
              appFunctions.searchFunctions[component.onSearch]
            ) {
              appFunctions.searchFunctions[component.onSearch](
                value,
                appState,
                component
              );
            } else {
              console.log(
                `Function ${component.onSearch} not found in appFunctions`
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
