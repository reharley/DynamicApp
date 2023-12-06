import React, { useState } from "react";
import { Form, Input, Button, Select, List, Typography, Tag } from "antd";
import ticketService from "../services/ticketService";

const { Option } = Select;
const { Text } = Typography;

const TicketEditor = ({ tickets, setTickets, ticketTypes }) => {
  const [form] = Form.useForm();

  const addTicket = async (values) => {
    const ticketObject = {
      type: values.type,
      status: "Open",
      description: values.description,
    };

    const returnedTicket = await ticketService.createTicket(ticketObject);
    setTickets(tickets.concat(returnedTicket));
    form.resetFields();
  };

  const deleteTicket = async (id) => {
    await ticketService.deleteTicket(id);
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };

  const getTypeNameById = (id) => {
    const type = ticketTypes.find((type) => type.id === id);
    return type ? type.name : "Unknown";
  };

  return (
    <div>
      <h2>Tickets</h2>
      <Form form={form} onFinish={addTicket}>
        <Form.Item
          name="type"
          rules={[{ required: true, message: "Please select a ticket type" }]}
        >
          <Select placeholder="Select a type">
            {ticketTypes.map((type) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input placeholder="Enter a description" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
      <List
        itemLayout="horizontal"
        dataSource={tickets}
        renderItem={(ticket) => (
          <List.Item
            actions={[
              <Button danger onClick={() => deleteTicket(ticket.id)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={getTypeNameById(ticket.type)}
              description={ticket.description}
            />
            <Tag color="blue">{ticket.status}</Tag>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TicketEditor;
