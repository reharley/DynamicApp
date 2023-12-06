import React from 'react';
import { Collapse, List, Typography, Tag } from 'antd';

const { Panel } = Collapse;
const { Text } = Typography;

const TicketQueue = ({ tickets, ticketTypes }) => {
  const getTypeNameById = (id) => {
    const type = ticketTypes.find((type) => type.id === parseInt(id));
    return type ? type.name : 'Unknown';
  };

  const ticketsByType = ticketTypes.reduce((groups, type) => {
    groups[type.id] = tickets.filter(ticket => ticket.type === type.id && ticket.status !== 'Resolved');
    return groups;
  }, {});

  return (
    <div>
      <h2>Ticket Queue</h2>
      <Collapse accordion>
        {Object.entries(ticketsByType).map(([typeId, tickets]) => (
          <Panel header={getTypeNameById(typeId)} key={typeId}>
            <List
              itemLayout="horizontal"
              dataSource={tickets}
              renderItem={ticket => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text>{ticket.description}</Text>}
                  />
                  <Tag color="blue">{ticket.status}</Tag>
                </List.Item>
              )}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default TicketQueue;