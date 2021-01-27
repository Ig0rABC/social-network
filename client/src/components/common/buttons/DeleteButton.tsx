import React from "react";
import { Button } from "antd";
import { FormattedMessage } from "react-intl";

type Props = {
  type?: "text" | "link" | "ghost" | "default" | "primary" | "dashed" | undefined
  onClick: () => void,
}

const DeleteButton: React.FC<Props> = ({ onClick, type = "text" }) => {
  return <Button onClick={onClick} danger type={type}>
    <FormattedMessage
      id="buttons.delete"
      defaultMessage="delete"
    />
  </Button>
}

export default DeleteButton;