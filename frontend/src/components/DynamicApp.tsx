// components/DynamicApp.js
import React, { useState, useRef } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
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
import appJSON from "../apps/chatbot";
import { AppState } from "../utils/AppState";
import * as appFunctions from "../appFunctions";
import { App, Component } from "../types/types";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;
let _app: App = appJSON;
let appState: AppState;

interface RenderComponentProps {
  component: Component;
}
const RenderComponent = ({ component }: RenderComponentProps) => {
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
        <RenderComponent key={child.name} component={child} />
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
                  <RenderComponent component={child.properties.element} />
                }
              />
            ))}
        </Routes>
      );
    case "CustomView":
      return (
        <RenderComponent
          component={appState.getCustomView(properties.viewName)}
        />
      );

    case "Text":
      return <Text {...properties}>{properties.text}</Text>;
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
                  <RenderComponent component={customViewClone} />
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
              <RenderComponent key={child.name} component={child} />
            ))}
        </List.Item>
      );

    case "List.Item.Meta":
      console.log("List.Item.Meta", commonProps);
      return (
        <List.Item.Meta
          avatar={
            properties.avatar && (
              <RenderComponent component={properties.avatar} />
            )
          }
          title={
            properties.title && <RenderComponent component={properties.title} />
          }
          description={
            properties.description && (
              <RenderComponent component={properties.description} />
            )
          }
        />
      );

    // case "ReactJson":
    //   // return <ReactJson {...properties} />;

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
                        <RenderComponent key={child.name} component={child} />
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

const DynamicApp = () => {
  const [app, setApp] = useState(_app);
  const location = useLocation();
  if (appState === null) appState = new AppState(app, setApp, location);
  appState.setState(app, setApp, location);
  return <RenderComponent component={app} />;
};

export default DynamicApp;
