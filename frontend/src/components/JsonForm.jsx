import React from 'react';
import { Form, Card, Input } from 'antd';

const JsonForm = ({ jsonData }) => {
  return (
    <Form>
      <Form.List name="cards">
        {(fields, { add, remove }) => (
          <>
            {jsonData.map((card, cardIndex) => (
              <Card key={cardIndex} title={card.title}>
                {card.fields.map((field, fieldIndex) => (
                  <Form.Item
                    key={fieldIndex}
                    name={[cardIndex, 'fields', fieldIndex, field.name]}
                    label={field.label}
                  >
                    <Input placeholder={field.label} />
                  </Form.Item>
                ))}
              </Card>
            ))}
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default JsonForm;
