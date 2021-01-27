import React from "react";
import { FormattedMessage } from "react-intl";
import useAuthorized from "../../hooks/useAuthorized";
import RegisterForm from "./RegisterForm";

const Register: React.FC = () => {

  useAuthorized();

  return <div>
    <FormattedMessage
      id="registration"
      defaultMessage="registration"
      description="Inscription above the registration form"
    />
    <RegisterForm />
  </div>
}

export default Register;