import React from "react";
import { FormattedMessage } from "react-intl";
import { Descriptions } from "antd";
import { Contacts as ContactsType } from "../../../types/models";

const { Item } = Descriptions;

type Props = {
  contacts: ContactsType
}

const Contacts: React.FC<Props> = ({ contacts }) => {
  return <Descriptions>
    {Object.keys(contacts).map(key => {
      const title = key as keyof typeof contacts;
      return contacts[title]
        && <Item key={title} label={title === "phoneNumber"
          ? <FormattedMessage
            id="phone-number"
            defaultMessage="phone number"
          />
          : key.capitalize()
        }>{contacts[title]}</Item>
    })}
  </Descriptions>
}

export default Contacts;