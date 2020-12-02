import React from "react";
import { Button, Space } from "antd";
import { FormattedMessage } from "react-intl";

type Props = {
  type?: "text" | "link" | "ghost" | "default" | "primary" | "dashed" | undefined
  onEditClick: () => void,
  onDeleteClick: () => void
}

const EditAndDeleteButtons: React.FC<Props> = ({ onEditClick, onDeleteClick, type="text" }) => {
  return <Space>
    <Button onClick={onEditClick} type={type}>
      <FormattedMessage
        id="buttons.edit"
        defaultMessage="edit"
      />
    </Button>
    <Button onClick={onDeleteClick} danger type={type}>
      <FormattedMessage
        id="buttons.delete"
        defaultMessage="delete"
      />
    </Button>
  </Space>
}

export default EditAndDeleteButtons;