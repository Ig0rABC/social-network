import React from "react";
import { Descriptions } from "antd";
import { Contacts as ContactsType } from "../../../../types/models";
import Contact from "./Contact";

type Props = {
  contacts: ContactsType
}

const Contacts: React.FC<Props> = ({ contacts }) => {
  return <Descriptions>
    {Object.keys(contacts).map(key => {
      return contacts[key as keyof typeof contacts]
        && <Contact
          title={key as keyof typeof contacts}
          value={contacts[key as keyof typeof contacts]}
        />
    })}
  </Descriptions>
}

export default Contacts;