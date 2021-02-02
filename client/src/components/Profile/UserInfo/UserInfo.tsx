import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Profile } from "../../../types/models";
import { selectProfileEditMode } from "../../../redux/selectors/users";
import { setProfileEditMode } from "../../../redux/actions/users";
import UserInfoForm from "./UserInfoForm";
import Contacts from "./Contacts";
import { Button } from "@material-ui/core";

type Props = {
  profile: Profile,
  isOwn: boolean
}

const UserInfo: React.FC<Props> = ({ profile, isOwn }) => {

  const dispatch = useDispatch();
  const editMode = useSelector(selectProfileEditMode)

  if (editMode) return (
    <UserInfoForm profile={profile} />
  )

  const { contacts, about } = profile;

  const handleEditClick = () => {
    dispatch(setProfileEditMode(true));
  }

  const editButton = (
    <Button onClick={handleEditClick}>
      <FormattedMessage id="buttons.edit" />
    </Button>
  )

  return <div>
    {contacts
      && <FormattedMessage
        id="contacts"
        defaultMessage="contacts"
      />
    }
    <Contacts contacts={contacts} />
  </div>
}

export default UserInfo;