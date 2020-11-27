import React from "react";
import { Space, Button, Tooltip } from 'antd';
import { FormattedMessage, FormattedNumber } from "react-intl";

type Props = {
  icon: React.FC | "img",
  count: number,
  messageId: string,
  defaultMessage?: string,
  isSubmitting?: boolean,
  onClick: () => void
}

const IconCount: React.FC<Props> = ({ icon, count, messageId, defaultMessage, isSubmitting, onClick }) => (
  <Space>
    <Tooltip title={<FormattedMessage id={messageId} defaultMessage={defaultMessage} />}>
      <Button type="link" onClick={onClick} disabled={isSubmitting}>
        {React.createElement(icon)}
      </Button>
    </Tooltip>
    <FormattedNumber
      value={count}
    />
  </Space>
);

export default IconCount;