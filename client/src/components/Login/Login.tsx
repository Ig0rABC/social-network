import { Grid, Typography } from "@material-ui/core";
import React from "react";
import useAuthorized from "../../hooks/useAuthorized";
import LoginForm from "./LoginForm";

const Login: React.FC = () => {

  useAuthorized();

  return <LoginForm />
}

export default Login;