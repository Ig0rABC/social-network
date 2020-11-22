import React from "react";
import { FormattedMessage } from "react-intl";
import RegisterForm from "./RegisterForm";

const Register: React.FC = () => {
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