import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Descriptions } from 'antd';
import ProfileAvatar from "./ProfileAvatar";
import { selectSelectedUserProfile } from "../../redux/selectors/users";
import { requestUserProfile } from "../../redux/thunks/users";

type Props = {
  userId: number
}

const ProfileInfo: React.FC<Props> = ({ userId }) => {

  const dispatch = useDispatch();
  const selectedUserProfile = useSelector(selectSelectedUserProfile);
  const { login, firstName, lastName, photoUrl, contacts, about } = selectedUserProfile;

  useEffect(() => {
    dispatch(requestUserProfile(userId))
  }, [])

  const title = firstName || lastName
    ? `${login}, ${firstName} ${lastName}`
    : login

  return <div>
    <ProfileAvatar photoUrl={photoUrl as string} />
    <Descriptions title={title} bordered>
      <Descriptions.Item label={<FormattedMessage id="about" defaultMessage="about" />} span={3}>
        {about}
      </Descriptions.Item>
      {
        Object.keys(contacts).map(key => {
          // @ts-ignore
          return contacts[key]
            && <Descriptions.Item key={key} label={key} span={3}>
              {//@ts-ignore
                contacts[key]}
            </Descriptions.Item>
        })
      }
    </Descriptions>
  </div>
}

export default ProfileInfo;