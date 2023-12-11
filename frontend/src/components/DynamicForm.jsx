import React, { useEffect } from "react";
import { Form, Input, DatePicker, Button, Select } from "antd";
import * as appFunctions from "../appFunctions";

const { Option } = Select;
const { TextArea } = Input;

const DynamicForm = ({ component, appState }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    const currentFormInstance = appState.getFormInstance(component.name);
    if (currentFormInstance !== form) {
      appState.setFormInstance(component.name, form);
      // Initialize events after the form instance is set
      if (currentFormInstance === null) appState._initEvents(component);
    }
    return () => {
      appState.setFormInstance(component.name, null);
    };
  }, []);
  return (
    <Form
      form={form}
      layout={component.properties.layout}
      onFinish={(values) =>
        appFunctions[component.properties.onSubmit](values, appState)
      }
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
            appFunctions[fieldConfig.properties.onChange](
              form,
              fieldConfig,
              appState
            );
          }
        });
      }}
    >
      {component.properties.items.map((item) => {
        switch (item.type) {
          case "Input":
            return (
              <Form.Item
                key={item.properties.name}
                name={item.properties.name}
                label={item.label}
              >
                <Input />
              </Form.Item>
            );
          case "DatePicker":
            return (
              <Form.Item
                key={item.properties.name}
                name={item.properties.name}
                label={item.label}
              >
                <DatePicker />
              </Form.Item>
            );
          case "Select":
            return (
              <Form.Item
                key={item.properties.name}
                name={item.properties.name}
                label={item.label}
              >
                <Select>
                  {item.options.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          case "TextArea":
            return (
              <Form.Item
                key={item.properties.name}
                name={item.properties.name}
                label={item.label}
              >
                <TextArea />
              </Form.Item>
            );
          default:
            return null;
        }
      })}
      <Form.Item>
        <Button {...component.properties.submitButton.properties}>
          {component.properties.submitButton.properties.text}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicForm;
