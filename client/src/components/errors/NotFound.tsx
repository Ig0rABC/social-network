import React from "react";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Button } from "@material-ui/core";

const NotFound: React.FC = () => {

  const history = useHistory();

  const handleClick = () => {
    history.goBack();
  }

  return <div>
    <FormattedMessage id="errors.404.title" />
    <FormattedMessage id="errors.404.description" />
    <Button onClick={handleClick}><FormattedMessage id="buttons.go-back" /></Button>
  </div>
}

export default NotFound;