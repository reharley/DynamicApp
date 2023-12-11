// components/DynamicApp.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Card, Table, Modal } from "antd";

import DynamicForm from "./DynamicForm";
import appJSON from "../data/sample_app3.json";
import { AppState } from "../utils/AppState";

const { Header, Content, Footer } = Layout;

let appState = null;

const renderComponent = (component) => {
  if (appState === null) return <React.Fragment />;
  switch (component.type) {
    case "Layout":
      return (
        <Layout style={component.properties.style}>
          {component.children &&
            component.children.map((child) => renderComponent(child))}
        </Layout>
      );
    case "Header":
      return (
        <Header>
          {component.children &&
            component.children.map((child) => renderComponent(child))}
        </Header>
      );
    case "Content":
      return (
        <Content style={component.properties.style}>
          {component.children &&
            component.children.map((child) => renderComponent(child))}
        </Content>
      );
    case "Row":
      return (
        <Row gutter={component.properties.gutter}>
          {component.children &&
            component.children.map((child) => renderComponent(child))}
        </Row>
      );
    case "Col":
      return (
        <Col span={component.properties.span}>
          {component.children &&
            component.children.map((child) => renderComponent(child))}
        </Col>
      );
    case "Menu":
      return (
        <Menu {...component.properties}>
          {component.children &&
            component.children.map((item) => {
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
      return (
        <Card title={component.properties.title}>
          {component.children &&
            component.children.map((child) => renderComponent(child))}
        </Card>
      );
    case "Form":
      return <DynamicForm component={component} appState={appState} />;
    case "Table":
      return (
        <Table
          columns={component.properties.columns}
          dataSource={component.properties.dataSource}
        />
      );
    case "Footer":
      return <Footer>{component.properties.text}</Footer>;
    case "Modal":
      return (
        <Modal
          title={component.properties.title}
          visible={component.properties.visible}
        >
          {component.properties.content}
        </Modal>
      );
    case "Breadcrumb":
      return (
        <Breadcrumb>
          {component.properties.items.map((item) => (
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
