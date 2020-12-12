import React from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { TeamOutlined } from "@ant-design/icons";

type Props = {
  followersCount: number | null
}

const FollowersCount: React.FC<Props> = ({ followersCount }) => {
  return <div>
    <TeamOutlined />
    <FormattedMessage
      id="followers-count"
      values={{
        count: <FormattedNumber value={followersCount as number} />
      }}
    />
  </div>
}

export default FollowersCount;