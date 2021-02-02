import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Button, ButtonGroup, FormControlLabel, Grid, Switch, TextField } from "@material-ui/core";
import { signIn } from "../../redux/thunks/users";
import { AccountCircle, Lock, LockOpen, LockOpenSharp } from "@material-ui/icons";

const LoginForm: React.FC = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleClick = () => {
    setSubmitting(true);
    dispatch(signIn({ login, password, rememberMe }));
  };

  return <form>
    <Grid container direction="column" spacing={2}>

      <Grid item container spacing={2} alignItems="flex-end">
        <Grid item>
          <AccountCircle />
        </Grid>
        <Grid item>
          <TextField id="login"
            label={<FormattedMessage id="forms.login" />}
            value={login}
            onChange={({ target }) => setLogin(target.value)}
            disabled={isSubmitting}
          />
        </Grid>
      </Grid>

      <Grid item container spacing={2} alignItems="flex-end">
        <Grid item>
          {isSubmitting
            ? <LockOpen />
            : <Lock />
          }
        </Grid>
        <Grid item>
          <TextField id="password"
            label={<FormattedMessage id="forms.password" />}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            disabled={isSubmitting}
          />
        </Grid>
      </Grid>

      <Grid item>
        <FormControlLabel
          label={<FormattedMessage id="forms.remember-me" />}
          control={<Switch id="forms.rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            disabled={isSubmitting}
            color="primary"
          />}
        />
      </Grid>

      <Grid item>
        <ButtonGroup disabled={isSubmitting} size="large" color="primary">
          <Button onClick={handleClick} variant="contained">
            <FormattedMessage id="buttons.sign-in" />
          </Button>
          <Button onClick={() => history.push("/register")} variant="text">
            <FormattedMessage id="register-now" />
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  </form>
}

export default LoginForm;