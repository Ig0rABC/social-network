import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Button } from "antd";
import { logout } from "../../redux/reducers/users";
import { selectIsAuthorized } from "../../redux/selectors/users";

const LogoutButton: React.FC = () => {

  const dispatch = useDispatch();
  let [isSubmitting, setSubmitting] = useState(false);
  const isAuthorized = useSelector(selectIsAuthorized);

  const handleOnClick = () => {
    setSubmitting(true);
    dispatch(logout());
  }

  useEffect(() => {
    setSubmitting(false);
  }, [isAuthorized])

  return <Button onClick={handleOnClick} disabled={isSubmitting}>
    <FormattedMessage id="buttons.sign-out" defaultMessage="sign out" />
  </Button>
}

export default LogoutButton;