// components/DynamicForm.jsx
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
  const renderFormItem = (item) => {
    // Switch statement to render form input based on type
    const formInput = (() => {
      switch (item.type) {
        case "Input":
          return <Input />;
        case "DatePicker":
          return <DatePicker />;
        case "Select":
          return (
            <Select>
              {item.options.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          );
        case "TextArea":
          return <TextArea />;
        default:
          return null;
      }
    })();
    console.log("item", item);
    return (
      <Form.Item
        key={item.name}
        name={item.name}
        label={item.label}
        rules={item.rules}
      >
        {formInput}
      </Form.Item>
    );
  };

  return (
    <Form
      form={form}
      layout={component.properties.layout}
      onFinish={(values) =>
        appFunctions[component.properties.onSubmit](values, appState)
      }
      onFieldsChange={(changedFields, allFields) => {
        console.log("changedFields", changedFields, allFields);
        changedFields.forEach((field) => {
          const fieldName = field.name[field.name.length - 1];
          // Check if the changed field has a linked function and execute it
          const fieldConfig = component.items.find(
            (item) => item.name === fieldName
          );
          if (
            fieldConfig &&
            fieldConfig.onChange &&
            appFunctions[fieldConfig.onChange]
          ) {
            appFunctions[fieldConfig.onChange](form, fieldConfig, appState);
          }
        });
      }}
    >
      {component.items.map(renderFormItem)}
      <Form.Item>
        <Button {...component.properties.submitButton.properties}>
          {component.properties.submitButton.properties.text}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicForm;
