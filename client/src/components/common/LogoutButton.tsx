import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from 'antd';
import usersAPI from "../../api/users";

const LogoutButton: React.FC = () => {

  let [isSubmitting, setSubmitting] = useState(false);

  const handleOnClick = () => {
    setSubmitting(true);
    try {
      usersAPI.logout();
    } catch {}
    setSubmitting(false);
  }

  return <Button onClick={handleOnClick} disabled={isSubmitting}>
    <FormattedMessage id="buttons.sign-out" defaultMessage="sign out" />
  </Button>
}

export default LogoutButton;