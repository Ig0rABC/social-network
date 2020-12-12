import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Button, Descriptions, Divider } from 'antd';
import { EditOutlined } from "@ant-design/icons";
import { UserProfile } from "../../../types/models";
import { selectProfileEditMode } from "../../../redux/selectors/users";
import UserInfoForm from "./UserInfoForm";
import actions from "../../../redux/actions/users";
import Contacts from "./Contacts/Contacts"

type Props = {
  profile: UserProfile
}

const UserInfo: React.FC<Props> = ({ profile }) => {

  const dispatch = useDispatch();
  const editMode = useSelector(selectProfileEditMode)

  if (editMode) return (
    <UserInfoForm profile={profile} />
  )

  const { contacts, about } = profile;

  const handleEditClick = () => {
    dispatch(actions.setProfileEditMode(true));
  }

  const editButton = (
    <Button onClick={handleEditClick} icon={<EditOutlined />}>
      <FormattedMessage
        id="buttons.edit"
        defaultMessage="edit"
      />
    </Button>
  )

  return <div>
    <Descriptions
      extra={editButton}>
      <Descriptions.Item span={3}
        label={<FormattedMessage
          id="about"
          defaultMessage="about"
        />}
      >{about}</Descriptions.Item>
    </Descriptions>
    {contacts
      && <Divider plain orientation="left">
        <FormattedMessage
          id="contacts"
          defaultMessage="contacts"
        />
      </Divider>
    }
    <Contacts contacts={contacts}/>
  </div>
}

export default UserInfo;