import React, { useState } from "react";
import usersAPI from "../../api/users";
import { FormattedMessage, useIntl } from "react-intl";
import { Form, Input, Button, Checkbox } from 'antd';
import { useDispatch } from "react-redux";
import { actions } from "../../redux/reducers/users";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

type LoginFormValues = {
  login: string,
  password: string,
  rememberMe: boolean
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
  const dispatch = useDispatch();
  let [isSubmitting, setSubmitting] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      const data = await usersAPI.login(values.login, values.password, values.rememberMe);
      dispatch(actions.setCurrentUser(data));
    } catch { }
    setSubmitting(false);
  };

  return <Form
    {...layout}
    initialValues={{ login: "", password: "", rememberMe: true }}
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

    <Form.Item {...tailLayout} name="rememberMe" valuePropName="checked">
      <Checkbox>
        <FormattedMessage id="remember-me" defaultMessage="remember me" />
      </Checkbox>
    </Form.Item>

    <Form.Item {...tailLayout}>
      <Button type="primary" htmlType="submit" disabled={isSubmitting}>
        <FormattedMessage id="buttons.sign-in" defaultMessage="sign in" />
      </Button>
    </Form.Item>
  </Form>
}

export default React.memo(LoginForm);