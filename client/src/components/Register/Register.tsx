import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { selectIsAuthorized } from "../../redux/selectors/users";
import RegisterForm from "./RegisterForm";

const Register: React.FC = () => {

  const isAuthorized = useSelector(selectIsAuthorized);
  const history = useHistory();

  useEffect(() => {
    if (isAuthorized) {
      history.push("/");
    }
  }, [isAuthorized])

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