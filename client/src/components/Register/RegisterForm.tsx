import React, { useState } from "react";
import usersAPI from "../../api/users";
import { FormattedMessage, useIntl } from "react-intl";
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from "@ant-design/icons";

type RegisterFormValues = {
  login: string,
  password: string
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const LoginForm: React.FC = () => {

  const intl = useIntl();
  let [isSubmitting, setSubmitting] = useState(false);

  const onFinish = async (values: RegisterFormValues) => {
    setSubmitting(true);
    try {
      const data = await usersAPI.register(values.login, values.password);
      console.log(data);
    } catch { }
    setSubmitting(false);
  };

  return <Form
    {...layout}
    initialValues={{ login: "", password: "" }}
    onFinish={onFinish}
  >

    <Form.Item name="login"
      rules={[
        {
          required: true,
          message: <FormattedMessage id="empty-login" defaultMessage="empty login" />
        }
      ]}
    ><Input prefix={<UserOutlined />} placeholder={intl.formatMessage({
      id: "placeholders.login",
      defaultMessage: "login"
    })} /></Form.Item>

    <Form.Item name="password"
      rules={[
        {
          required: true,
          message: <FormattedMessage id="empty-password" defaultMessage="empty password" />
        }
      ]}
    ><Input.Password prefix={<LockOutlined />} placeholder={intl.formatMessage({
      id: "placeholders.password",
      defaultMessage: "password"
    })} /></Form.Item>

    <Form.Item {...tailLayout}>
      <Button type="primary" htmlType="submit" disabled={isSubmitting}>
        <FormattedMessage id="buttons.sign-in" defaultMessage="sign in" />
      </Button>
    </Form.Item>

  </Form>
}

export default React.memo(LoginForm);