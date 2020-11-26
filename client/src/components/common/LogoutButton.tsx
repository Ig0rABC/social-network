import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from 'antd';
import usersAPI from "../../api/users";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/reducers/users";

const LogoutButton: React.FC = () => {

  const dispatch = useDispatch();
  let [isSubmitting, setSubmitting] = useState(false);

  const handleOnClick = () => {
    setSubmitting(true);
    try {
      usersAPI.logout();
    } catch { }
    dispatch(actions.resetCurrentUser());
    setSubmitting(false);
  }

  return <Button onClick={handleOnClick} disabled={isSubmitting}>
    <FormattedMessage id="buttons.sign-out" defaultMessage="sign out" />
  </Button>
}

export default LogoutButton;