import React from "react";
import { FormattedMessage } from "react-intl";
import { Descriptions } from "antd";
import { Contacts } from "../../../../types/models";

type Props = {
  title: keyof Contacts,
  value: string
}

const Contact: React.FC<Props> = ({ title, value }) => {
  return <Descriptions.Item key={title} label={title === "phoneNumber"
    ? <FormattedMessage
      id="phone-number"
      defaultMessage="phone number"
    />
    : title.capitalize()
  } span={3}>
    {value}
  </Descriptions.Item>
}

export default Contact;