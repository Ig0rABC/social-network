import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { register } from "../../redux/thunks/users";

type RegisterFormValues = {
  login: string,
  password: string
}

const LoginForm: React.FC = () => {

  const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState(false);

  const onFinish = (values: RegisterFormValues) => {
    setSubmitting(true);
    dispatch(register(values));
  };

  return <div>
    REGISTER FORM
  </div>
}

export default LoginForm;