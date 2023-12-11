// components/DynamicApp.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Card, Table, Modal } from "antd";

import DynamicForm from "./DynamicForm";
import appJSON from "../data/sample_app3.json";
import { AppState } from "../utils/AppState";
import * as appFunctions from "../appFunctions";

const { Header, Content, Footer } = Layout;

let appState = null;

const renderComponent = (component) => {
  if (!appState || !component) return <React.Fragment />;
  const { type, children } = component;
  let properties = component.properties ?? {};

  const commonProps = {
    ...properties,
    component,
    children: children && children.map((child) => renderComponent(child)),
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
          {children &&
            children.map((item) => {
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
    default:
      return null;
  }
};

const DynamicApp = () => {
  const [app, setApp] = useState(appJSON.app);

  useEffect(() => {
    console.log("app", app);
    if (appState === null) appState = new AppState(app, setApp);
  }, []);

  return renderComponent(appState?.app);
};

export default DynamicApp;
