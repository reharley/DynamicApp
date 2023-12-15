// components/DynamicForm.jsx
import React from "react";
import { Form, InputNumber, Input, DatePicker, Button, Select } from "antd";
import * as appFunctions from "../appFunctions";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const DynamicForm = ({ component, appState }) => {
  const [form] = Form.useForm();
  const currentComponentInstance = appState.getComponentInstance(
    component.name
  );
  if (currentComponentInstance !== form) {
    appState.setComponentInstance(component.name, form);
    if (currentComponentInstance === undefined && component.onInit)
      if (appFunctions[component.onInit] === undefined)
        console.log(`Function ${component.onInit} not found`);
      else appFunctions[component.onInit](appState);
  }

  const renderFormItem = (item) => {
    // Switch statement to render form input based on type
    const formInput = (() => {
      switch (item.type) {
        case "Input":
          return <Input {...item.properties} />;
        case "DatePicker":
          return <DatePicker {...item.properties} />;
        case "RangePicker":
          return <RangePicker {...item.properties} />;
        case "Select":
          return <Select {...item.properties} />;
        case "TextArea":
          return <TextArea {...item.properties} />;
        case "InputNumber":
          return <InputNumber {...item.properties} />;
        default:
          return null;
      }
    })();

    return (
      <Form.Item {...item} key={item.name} onChange={undefined}>
        {formInput}
      </Form.Item>
    );
  };

  return (
    <Form
      form={form}
      layout={component.properties.layout}
      onFinish={(values) =>
        appFunctions[component.properties.onSubmit](values, appState, component)
      }
      onFieldsChange={(changedFields, allFields) => {
        changedFields.forEach((field) => {
          const fieldName = field.name[field.name.length - 1];
          // Check if the changed field has a linked function and execute it
          const fieldComponent = component.items.find(
            (item) => item.name === fieldName
          );
          if (
            fieldComponent &&
            fieldComponent.onChange &&
            appFunctions[fieldComponent.onChange]
          ) {
            appFunctions[fieldComponent.onChange](
              form,
              fieldComponent,
              appState
            );
          }
        });
      }}
    >
      {component.items.map(renderFormItem)}
      <Form.Item>
        <Button {...component.properties.submitButton?.properties}>
          {component.properties.submitButton?.properties?.text}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicForm;
