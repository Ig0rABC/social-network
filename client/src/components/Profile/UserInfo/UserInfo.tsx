import React from "react";
import { FormattedMessage } from "react-intl";
import { Button, Descriptions } from 'antd';
import { UserProfile } from "../../../types/models";
import UserInfoForm from "./UserInfoForm";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { selectProfileEditMode } from "../../../redux/selectors/users";
import actions from "../../../redux/actions/users";

type Props = {
  profile: UserProfile
}

const UserInfo: React.FC<Props> = ({ profile }) => {

  const dispatch = useDispatch();
  const editMode = useSelector(selectProfileEditMode)

  if (editMode) return (
    <UserInfoForm profile={profile} />
  )

  const { login, firstName, lastName, contacts, about } = profile;
  const title = firstName || lastName
    ? `${login}, ${firstName} ${lastName}`
    : login

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

  return <Descriptions bordered
    title={title}
    extra={editButton}>
    <Descriptions.Item span={3}
      label={<div><FormattedMessage id="about" defaultMessage="about" />:</div>}
    >
      {about}
    </Descriptions.Item>
    {
      Object.keys(contacts).map(key => {
        // @ts-ignore
        return contacts[key]
          && <Descriptions.Item key={key} label={key === "phoneNumber"
            ? <div><FormattedMessage id="phone-number" defaultMessage="phone number" />:</div>
            : key.capitalize() + ":"
          } span={3}>
            {//@ts-ignore
              contacts[key]
            }
          </Descriptions.Item>
      })
    }
  </Descriptions>
}

export default UserInfo;