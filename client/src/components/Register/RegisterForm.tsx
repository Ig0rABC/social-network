import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { FormattedMessage } from "react-intl";
import usersAPI from "../../api/users";

type RegisterFormValues = {
  login: string,
  password: string
}

const RegisterForm: React.FC = () => {

  const onSubmit = async (values: RegisterFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const userData = await usersAPI.register(values.login, values.password);
    console.log(userData);
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
      <button type="submit" disabled={isSubmitting}>
        <FormattedMessage
          id="sign-up"
          defaultMessage="sign up"
          description="sign up button"
        />
      </button>
    </Form>
  }

  return <Formik
    enableReinitialize={true}
    initialValues={{ login: "", password: "" }}
    onSubmit={onSubmit}
  >{createForm}</Formik>
}

export default React.memo(RegisterForm);