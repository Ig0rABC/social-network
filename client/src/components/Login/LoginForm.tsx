import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { signIn } from "../../redux/thunks/users";
import { NavLink } from "react-router-dom";

type LoginFormValues = {
  login: string,
  password: string,
  rememberMe: boolean
}

const LoginForm: React.FC = () => {

  const intl = useIntl();
  const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState(false);

  const onFinish = (values: LoginFormValues) => {
    setSubmitting(true);
    dispatch(signIn(values));
  };

  const loginPlaceholder = intl.formatMessage({
    id: "placeholders.login",
    defaultMessage: "login"
  });
  const passwordPlaceholder = intl.formatMessage({
    id: "placeholders.password",
    defaultMessage: "password"
  });

  return <Form
    initialValues={{ rememberMe: true }}
    onFinish={onFinish}
  >

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

    <Form.Item name="rememberMe" valuePropName="checked">
      <Checkbox>
        <FormattedMessage
          id="remember-me"
          defaultMessage="remember me"
        />
      </Checkbox>
    </Form.Item>

    <NavLink to="/register">
      <FormattedMessage
        id="register-now"
        defaultMessage="register now"
      />
    </NavLink>

    <Form.Item>
      <Button type="primary" htmlType="submit" disabled={isSubmitting}>
        <FormattedMessage
          id="buttons.sign-in"
          defaultMessage="sign in"
        />
      </Button>
    </Form.Item>
  </Form>
}

export default React.memo(LoginForm);