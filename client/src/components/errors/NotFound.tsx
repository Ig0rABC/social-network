import React from "react";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Button, Result } from "antd";

const NotFound: React.FC = () => {

  const history = useHistory();

  const handleClick = () => {
    history.goBack();
  }

  return <Result
    title={<FormattedMessage id="errors.404.title" />}
    subTitle={<FormattedMessage id="errors.404.description" />}
    extra={<Button onClick={handleClick}><FormattedMessage id="buttons.go-back" /></Button>}
  />
}

export default NotFound;