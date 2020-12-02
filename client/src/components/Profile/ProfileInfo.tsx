import React from "react";
import { Descriptions } from 'antd';
import { FormattedMessage } from "react-intl";
import { UserProfile } from "../../types/models";
import ProfileAvatar from "./ProfileAvatar";

type Props = UserProfile;

const ProfileInfo: React.FC<Props> = ({ id, login, photoUrl, firstName, lastName, about, contacts }) => {

  const title = firstName || lastName
    ? `${login}, ${firstName} ${lastName}`
    : login

  return <div>
    <ProfileAvatar photoUrl={photoUrl} />
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