import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { FormattedMessage } from "react-intl";
import usersAPI from "../../api/users";

type LoginFormValues = {
  login: string,
  password: string,
  rememberMe: boolean
}

const LoginForm: React.FC = () => {

  const onSubmit = async (values: LoginFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const data = await usersAPI.login(values.login, values.password, values.rememberMe);
    console.log(data);
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
      />: <Field name="password" type="password" />
      <FormattedMessage
        id="remember-me"
        defaultMessage="remember me"
        description="rember me checkbox"
      /><Field name="rememberMe" type="checkbox" />
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
    initialValues={{ login: "", password: "", rememberMe: false }}
    onSubmit={onSubmit}
  >{createForm}</Formik>
}

export default React.memo(LoginForm);