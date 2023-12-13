// components/DynamicApp.js
import React, { useState, useEffect, useRef } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Card, Table, Modal } from "antd";

import DynamicForm from "./DynamicForm";
import appJSON from "../data/sample_app3.json";
import { AppState } from "../utils/AppState";
import * as appFunctions from "../appFunctions";

const { Header, Content, Footer } = Layout;

let appState = null;

const RenderComponent = ({ component }) => {
  const componentRef = useRef(null);
  if (!appState || !component) return <React.Fragment />;

  const currentComponentInstance = appState.getComponentInstance(
    component.name
  );
  if (currentComponentInstance !== componentRef) {
    appState.setComponentInstance(component.name, componentRef);
    if (currentComponentInstance === undefined && component.onInit) {
      appFunctions[component.onInit](appState, component);
    }
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
        <Menu {...properties}>
          {component.items &&
            component.items.map((item) => {
              if (item.type === "MenuItem") {
                return (
                  <Menu.Item key={item.properties.key}>
                    <Link to={item.properties.link}>{item.text}</Link>
                  </Menu.Item>
                );
              }
              return null;
            })}
        </Menu>
      );
    case "Card":
      return <Card {...commonProps} />;
    case "Form":
      return <DynamicForm {...commonProps} appState={appState} />;
    case "Table":
      const onRow = (record, rowIndex) => {
        return {
          onClick: () => {
            if (
              component.properties.onRow &&
              component.properties.onRow.click
            ) {
              const functionName = component.properties.onRow.click;
              if (appFunctions[functionName]) {
                appFunctions[functionName](record, rowIndex, appState);
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
    case "Breadcrumb":
      return (
        <Breadcrumb {...commonProps}>
          {properties.items.map((item) => (
            <Breadcrumb.Item key={item.name} href={item.link}>
              {item.name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      );

    case "Routes":
      return (
        <Routes {...commonProps}>
          {children.map((child) => (
            <Route
              key={child.name}
              path={child.properties.path}
              element={<RenderComponent component={child.properties.element} />}
            />
          ))}
        </Routes>
      );
    case "CustomView":
      return (
        <RenderComponent
          component={appState.app.customViews[properties.viewName]}
        />
      );

    default:
      return null;
  }
};

const DynamicApp = () => {
  const [app, setApp] = useState(appJSON?.app);
  if (appState === null) appState = new AppState(app, setApp);
  appState.setState(app, setApp);
  return <RenderComponent component={app} />;
};

export default DynamicApp;
