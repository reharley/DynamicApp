import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Card, Table, Modal } from "antd";

import DynamicForm from "./DynamicForm";

import appJSON from "../data/sample_app3.json";

const { Header, Content, Footer } = Layout;

const renderComponent = (component) => {
  switch (component.type) {
    case "Layout":
      return (
        <Layout style={component.properties.style}>
          {component.properties.children.map((child) => renderComponent(child))}
        </Layout>
      );
    case "Header":
      return (
        <Header>
          {component.properties.children.map((child) => renderComponent(child))}
        </Header>
      );
    case "Content":
      return (
        <Content style={component.properties.style}>
          {component.properties.children.map((child) => renderComponent(child))}
        </Content>
      );
    case "Row":
      return (
        <Row gutter={component.properties.gutter}>
          {component.properties.children.map((child) => renderComponent(child))}
        </Row>
      );
    case "Col":
      return (
        <Col span={component.span}>
          {component.children.map((child) => renderComponent(child))}
        </Col>
      );
    case "Menu":
      return (
        <Menu {...component.properties}>
          {component.items.map((item) => (
            <Menu.Item key={item.name}>
              <Link to={item.link}>{item.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      );
    case "Card":
      return (
        <Card title={component.title}>
          {component.children.map((child) => renderComponent(child))}
        </Card>
      );
    case "Form":
      return <DynamicForm component={component} />;
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
        <Modal title={component.properties.title} visible={false}>
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
  return renderComponent(appJSON.app);
};

export default DynamicApp;
