import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Button, Descriptions, Divider } from 'antd';
import { EditOutlined } from "@ant-design/icons";
import { Profile } from "../../../types/models";
import { selectProfileEditMode } from "../../../redux/selectors/users";
import { setProfileEditMode } from "../../../redux/actions/users";
import UserInfoForm from "./UserInfoForm";
import Contacts from "./Contacts/Contacts";

const { Item } = Descriptions;

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
    <Button
      onClick={handleEditClick}
      icon={<EditOutlined />}
    >
      <FormattedMessage
        id="buttons.edit"
        defaultMessage="edit"
      />
    </Button>
  )

  return <Fragment>
    <Descriptions
      extra={isOwn && editButton}>
      <Item span={3}
        label={<FormattedMessage
          id="about"
          defaultMessage="about"
        />}
      >{about}</Item>
    </Descriptions>
    {contacts
      && <Divider plain orientation="right">
        <FormattedMessage
          id="contacts"
          defaultMessage="contacts"
        />
      </Divider>
    }
    <Contacts contacts={contacts} />
  </Fragment>
}

export default UserInfo;