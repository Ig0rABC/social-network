import React from "react";
import { FormattedMessage } from "react-intl";
import { Contacts as ContactsType } from "../../../types/models";

type Props = {
  contacts: ContactsType
}

const Contacts: React.FC<Props> = ({ contacts }) => {
  return <div>
    CONTACTS
  </div>
}

export default Contacts;