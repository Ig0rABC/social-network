import React from "react";
import { FormattedMessage } from "react-intl";
import { Descriptions } from 'antd';
import { UserProfile } from "../../types/models";

type Props = {
  profile: UserProfile
}

const ProfileInfo: React.FC<Props> = ({ profile }) => {

  const { login, firstName, lastName, contacts, about } = profile;

  const title = firstName || lastName
    ? `${login}, ${firstName} ${lastName}`
    : login

  return <div>
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