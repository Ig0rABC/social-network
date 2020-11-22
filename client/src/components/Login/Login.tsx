import React from "react";
import { FormattedMessage } from "react-intl";
import LoginForm from "./LoginForm";

const Login: React.FC = () => {
  return <div>
    <FormattedMessage
      id="authorization"
      defaultMessage="authorization"
      description="authorization"
    />
    <LoginForm />
  </div>
}

export default Login;