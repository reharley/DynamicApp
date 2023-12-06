import React, { useState } from "react";
import { List, Input, Button, Form } from "antd";
import ticketService from "../services/ticketService";

const TicketTypeManager = ({ ticketTypes, setTicketTypes }) => {
  const [newType, setNewType] = useState("");
  const [form] = Form.useForm();

  const addType = async () => {
    const returnedType = await ticketService.createTicketType({
      name: newType,
    });
    setTicketTypes(ticketTypes.concat(returnedType));
    setNewType("");
    form.resetFields();
  };

  return (
    <div>
      <h2>Ticket Types</h2>
      <Form form={form} onFinish={addType}>
        <Form.Item
          name="newType"
          rules={[{ required: true, message: "Please enter a type" }]}
        >
          <Input
            placeholder="Enter a new type"
            onChange={(e) => setNewType(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Type
          </Button>
        </Form.Item>
      </Form>
      <List
        itemLayout="horizontal"
        dataSource={ticketTypes}
        renderItem={(type) => (
          <List.Item>
            <List.Item.Meta title={type.name} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default TicketTypeManager;
