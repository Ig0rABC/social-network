import React from "react";
import { Empty } from "antd";
import { FormattedMessage } from "react-intl";

const EmptyList: React.FC = () => {
  return <Empty
    image={Empty.PRESENTED_IMAGE_DEFAULT}
    description={<FormattedMessage
      id="no-data"
      defaultMessage="no data"
    />}
  />
}

export default EmptyList;