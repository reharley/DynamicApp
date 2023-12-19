// components/DynamicForm.jsx
import React from "react";
import { Form, InputNumber, Input, DatePicker, Button, Select } from "antd";
import * as appFunctions from "../appFunctions";
import { Component } from "../types/types";
import { AppState } from "../utils/AppState";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type DynamicFormProps = {
  component: Component;
  appState: AppState;
};
const DynamicForm = ({ component, appState }: DynamicFormProps) => {
  const [form] = Form.useForm();
  component.current = form;
  if (component.current === null && component.onInit)
    if (appFunctions.initFunctions[component.onInit] === undefined)
      console.log(`Function ${component.onInit} not found`);
    else appFunctions.initFunctions[component.onInit](appState, component);

  const renderFormItem = (item: Component) => {
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
        case "Button":
          return <Button {...item.properties}>{item.properties.text}</Button>;
        default:
          return null;
      }
    })();

    return (
      <Form.Item {...item} key={item.name}>
        {formInput}
      </Form.Item>
    );
  };

  return (
    <Form
      form={form}
      layout={component.properties.layout}
      onFinish={(values) =>
        appFunctions.formFinishFunctions[component.properties.onSubmit](
          values,
          appState,
          component
        )
      }
      onFieldsChange={(changedFields, allFields) => {
        changedFields.forEach((field) => {
          if (component.items === undefined) return;
          const fieldName = field.name[field.name.length - 1];
          // Check if the changed field has a linked function and execute it
          const fieldComponent = component.items.find(
            (item) => item.name === fieldName
          );
          if (
            fieldComponent &&
            fieldComponent.onChange &&
            appFunctions.formChangeFunctions[fieldComponent.onChange]
          ) {
            appFunctions.formChangeFunctions[fieldComponent.onChange](
              form,
              appState,
              fieldComponent
            );
          }
        });
      }}
    >
      {component.items && component.items.map(renderFormItem)}
    </Form>
  );
};

export default DynamicForm;
