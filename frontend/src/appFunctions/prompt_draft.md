create a function that on form submit will get the form values and send them to either create or update endpoint

```javascript
// services/objectService.js
import axios from "axios";

const baseUrl = "http://localhost:3001/api";

const getAllObjects = async () => {
  const response = await axios.get(`${baseUrl}/objects`);
  return response.data;
};

const createObject = async (newObject) => {
  const response = await axios.post(`${baseUrl}/objects`, newObject);
  return response.data;
};

const updateObject = async (id, updatedObject) => {
  const response = await axios.put(`${baseUrl}/objects/${id}`, updatedObject);
  return response.data;
};

const deleteObject = async (id) => {
  const response = await axios.delete(`${baseUrl}/objects/${id}`);
  return response.data;
};

export default {
  getAllObjects,
  createObject,
  updateObject,
  deleteObject,
  getAllObjectTypes,
  createObjectType,
  updateObjectType,
  deleteObjectType,
  getAllObjectWorkflows,
  createObjectWorkflow,
  updateObjectWorkflow,
  deleteObjectWorkflow,
};
```

```javascript
// appFunctions/index.js
export function updateEndDateRestriction(form, fieldConfig) {
  const startDate = form.getFieldValue("startDate");
  const endDate = form.getFieldValue("endDate");

  // Clear the end date if it is before the start date
  if (startDate && endDate && startDate.isAfter(endDate)) {
    form.setFields([
      {
        name: "endDate",
        value: null,
      },
    ]);
  }

  // Disable dates before the start date for the end date
  const disableEndDate = (current) => {
    return current && current.isBefore(startDate, "day");
  };

  // Update the 'disabledDate' property for the 'endDate' field
  form.setFields([
    {
      name: "endDate",
      disabledDate: disableEndDate,
    },
  ]);
}
```

```javascript
import React from "react";
import { Form, Input, DatePicker, Button, Select } from "antd";
import * as appFunctions from "../appFunctions";

const { Option } = Select;
const { TextArea } = Input;

const DynamicForm = ({ component }) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      layout={component.properties.layout}
      onFieldsChange={(changedFields, allFields) => {
        changedFields.forEach((field) => {
          const fieldName = field.name[field.name.length - 1];
          // Check if the changed field has a linked function and execute it
          const fieldConfig = component.properties.items.find(
            (item) => item.properties.name === fieldName
          );
          if (
            fieldConfig &&
            fieldConfig.properties.onChange &&
            appFunctions[fieldConfig.properties.onChange]
          ) {
            appFunctions[fieldConfig.properties.onChange](form, fieldConfig);
          }
        });
      }}
    >
      {component.properties.items.map((item) => {
        switch (item.type) {
          case "Input":
            return (
              <Form.Item name={item.properties.name} label={item.label}>
                <Input />
              </Form.Item>
            );
          case "DatePicker":
            return (
              <Form.Item name={item.properties.name} label={item.label}>
                <DatePicker />
              </Form.Item>
            );
          case "Select":
            return (
              <Form.Item name={item.properties.name} label={item.label}>
                <Select>
                  {item.options.map((option) => (
                    <Option value={option}>{option}</Option>
                  ))}
                </Select>
              </Form.Item>
            );
          case "TextArea":
            return (
              <Form.Item name={item.properties.name} label={item.label}>
                <TextArea />
              </Form.Item>
            );
          default:
            return null;
        }
      })}
      <Form.Item>
        <Button {...component.properties.submitButton.properties}>
          {component.properties.submitButton.properties.text + 3}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicForm;
```

```json
{
  "type": "Form",
  "properties": {
    "layout": "vertical",
    "items": [
      {
        "label": "Project ID",
        "type": "Input",
        "properties": {
          "name": "projectId",
          "style": { "display": "none" },
          "defaultValue": "Generated or Predefined ID"
        }
      },
      {
        "label": "Project Name",
        "type": "Input",
        "properties": {
          "name": "projectName"
        },
        "rules": [
          {
            "required": true,
            "message": "Please input the project name!"
          }
        ]
      },
      {
        "label": "Start Date",
        "type": "DatePicker",
        "properties": {
          "name": "startDate",
          "onChange": "updateEndDateRestriction"
        },
        "rules": [
          {
            "required": true,
            "message": "Please select the start date!"
          }
        ]
      },
      {
        "label": "End Date",
        "type": "DatePicker",
        "properties": {
          "name": "endDate"
        },
        "rules": [
          {
            "required": true,
            "message": "Please select the end date!"
          }
        ]
      },
      {
        "label": "Status",
        "type": "Select",
        "properties": {
          "name": "status"
        },
        "options": ["Planning", "Active", "Completed"],
        "rules": [
          {
            "required": true,
            "message": "Please select the status!"
          }
        ]
      },
      {
        "label": "Description",
        "type": "TextArea",
        "properties": {
          "name": "description"
        },
        "rules": [
          {
            "required": true,
            "message": "Please input the description!"
          }
        ]
      }
    ],
    "submitButton": {
      "type": "Button",
      "properties": {
        "type": "primary",
        "htmlType": "submit",
        "text": "Submit",
        "name": "submitButton"
      }
    }
  },
  "functions": {
    "updateEndDateRestriction": {
      "description": "This function is triggered when the start date changes. It should ensure the end date cannot be before the start date, clearing the end date if it is before the start date, and disabling dates before the start date for the end date."
    }
  }
}
```
