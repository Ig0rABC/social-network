import React from "react";
import { Button } from "antd";
import { FormattedMessage } from "react-intl";

type Props = {
  onClick: () => void,
  type?: "text" | "link" | "ghost" | "default" | "primary" | "dashed" | undefined
}

const EditButton: React.FC<Props> = ({ onClick, type = "text" }) => {
  return <Button onClick={onClick} type={type}>
    <FormattedMessage
      id="buttons.edit"
      defaultMessage="edit"
    />
  </Button>
}

export default EditButton;