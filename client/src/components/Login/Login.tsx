import React from "react";
import { FormattedMessage } from "react-intl";
import useAuthorized from "../../hooks/useAuthorized";
import LoginForm from "./LoginForm";

const Login: React.FC = () => {

  useAuthorized();

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