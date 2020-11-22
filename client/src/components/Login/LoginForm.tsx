import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { FormattedMessage } from "react-intl";

type LoginFormValues = {
  login: string,
  password: string
}

const LoginForm: React.FC = () => {

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (values: LoginFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setLogin(values.login);
    setPassword(values.password);
    console.log(values);
    setSubmitting(false);
  }

  const createForm = ({ isSubmitting }: { isSubmitting: boolean }) => {
    return <Form>
      <FormattedMessage
        id="login"
        defaultMessage="login"
        description="login input"
      />: <Field name="login" type="text" />
      <FormattedMessage
        id="password"
        defaultMessage="password"
        description="password input"
      />: <Field name="password" type="text" />
      <button type="submit" disabled={isSubmitting}>
        <FormattedMessage
          id="sign-in"
          defaultMessage="sign in"
          description="sign in button"
        />
      </button>
    </Form>
  }

  return <Formik
    enableReinitialize={true}
    initialValues={{ login, password }}
    onSubmit={onSubmit}
  >{createForm}</Formik>
}

export default React.memo(LoginForm);