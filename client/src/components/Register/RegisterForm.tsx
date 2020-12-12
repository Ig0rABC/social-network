import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { register } from "../../redux/thunks/users";

type RegisterFormValues = {
  login: string,
  password: string
}

const LoginForm: React.FC = () => {

  const dispatch = useDispatch();
  const intl = useIntl();
  const [isSubmitting, setSubmitting] = useState(false);

  const onFinish = (values: RegisterFormValues) => {
    setSubmitting(true);
    dispatch(register(values.login, values.password));
  };

  const loginPlaceholder = intl.formatMessage({
    id: "placeholders.login",
    defaultMessage: "login"
  });
  const passwordPlaceholder = intl.formatMessage({
    id: "placeholders.password",
    defaultMessage: "password"
  });

  return <Form onFinish={onFinish}>

    <Form.Item name="login"
      rules={[
        {
          required: true,
          message: (
            <FormattedMessage
              id="empty-login"
              defaultMessage="empty login"
            />
          )
        }
      ]}
    ><Input prefix={<UserOutlined />}
      placeholder={loginPlaceholder}
      /></Form.Item>

    <Form.Item name="password"
      rules={[
        {
          required: true,
          message: (
            <FormattedMessage
              id="empty-password"
              defaultMessage="empty password"
            />
          )
        }
      ]}
    ><Input.Password prefix={<LockOutlined />}
      placeholder={passwordPlaceholder}
      /></Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" disabled={isSubmitting}>
        <FormattedMessage
          id="buttons.sign-up"
          defaultMessage="sign up"
        />
      </Button>
    </Form.Item>

  </Form>
}

export default React.memo(LoginForm);