import React from "react";
import {
  Form,
  Space,
  Input,
  InputNumber,
  DatePicker,
  Checkbox,
  Button,
  Card,
  Switch,
} from "antd";

const DynamicForm = ({ schema, dataList }) => {
  const [form] = Form.useForm();
  const renderField = (field, namePath) => {
    const name = namePath[namePath.length - 1];
    let dynamicField = <React.Fragment />;
    switch (field.type) {
      case "string":
        dynamicField = <Input />;
        break;
      case "number":
        dynamicField = <InputNumber />;
        break;

      case "date":
        dynamicField = <DatePicker />;
        break;

      case "boolean":
        dynamicField = <Switch />;
        break;
    }
    return (
      <Form.Item
        name={[...namePath]}
        label={name}
        rules={[{ required: field.required }]}
      >
        {dynamicField}
      </Form.Item>
    );
  };

  const renderFields = (schema, namePath = []) => {
    if (schema.type === "array") {
      const itemName = namePath[namePath.length - 1];
      return (
        <Form.List>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Card
                  key={key}
                  title={itemName}
                  extra={
                    <Button type="link" onClick={() => remove(name)}>
                      Delete
                    </Button>
                  }
                >
                  <Space>
                    {renderFields(schema.items, [...namePath, name])}
                  </Space>
                </Card>
              ))}
              <Button type="dashed" onClick={() => add()}>
                Add {itemName}
              </Button>
            </>
          )}
        </Form.List>
      );
    } else if (schema.type === "object") {
      return (
        <Card
          key={namePath.join(".")}
          // title={name}
        >
          {/* <Form.Item> */}
          {Object.entries(schema.properties).map(([key, value]) =>
            renderFields(value, [...namePath, key])
          )}
          {/* </Form.Item> */}
        </Card>
      );
    } else {
      return renderField(schema, [...namePath]);
    }
  };
  const onFinish = (values) => {
    console.log("Received values:", values);
  };

  const onFill = () => {
    form.setFieldsValue(dataList);
  };
  // console.log(schema, dataList);
  return (
    <Form
      onFinish={onFinish}
      form={form}
      onFieldsChange={(...args) => console.log(args)}
      initialValues={dataList}
    >
      <Space>{renderFields(schema)}</Space>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Button type="link" htmlType="button" onClick={onFill}>
        Fill form
      </Button>
    </Form>
  );
};

export default DynamicForm;
