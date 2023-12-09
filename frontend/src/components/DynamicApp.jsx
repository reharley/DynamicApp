import React from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Row,
  Col,
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  TextArea,
  Table,
  Modal,
} from "antd";
import appJSON from "../data/sample_app3.json";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

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
          <div>{component.properties.title}</div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            {component.properties.menu.map((item, index) => (
              <Menu.Item key={index} href={item.link}>
                {item.name}
              </Menu.Item>
            ))}
          </Menu>
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
    case "Card":
      return (
        <Card title={component.title}>
          {component.children.map((child) => renderComponent(child))}
        </Card>
      );
    case "Form":
      return (
        <Form layout={component.properties.layout}>
          {component.properties.items.map((item) => {
            switch (item.type) {
              case "Input":
                return (
                  <Form.Item label={item.label}>
                    <Input />
                  </Form.Item>
                );
              case "DatePicker":
                return (
                  <Form.Item label={item.label}>
                    <DatePicker />
                  </Form.Item>
                );
              case "Select":
                return (
                  <Form.Item label={item.label}>
                    <Select>
                      {item.options.map((option) => (
                        <Option value={option}>{option}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              case "TextArea":
                return (
                  <Form.Item label={item.label}>
                    <TextArea />
                  </Form.Item>
                );
              default:
                return null;
            }
          })}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {component.properties.submitButton}
            </Button>
          </Form.Item>
        </Form>
      );
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

const App = () => {
  return renderComponent(appJSON.app);
};

export default App;
