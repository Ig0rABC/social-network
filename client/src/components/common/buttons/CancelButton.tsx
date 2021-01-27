import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "antd";

type Props = {
  onClick: () => void,
  type?: "text" | "link" | "ghost" | "default" | "primary" | "dashed"
}

const CancelButton: React.FC<Props> = ({ onClick, type = "default" }) => {
  return <Button onClick={onClick} type={type}>
    <FormattedMessage id="buttons.cancel" />
  </Button>
}

export default CancelButton;