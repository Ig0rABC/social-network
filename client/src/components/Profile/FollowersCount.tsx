import React from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";

type Props = {
  followersCount: number | null
}

const FollowersCount: React.FC<Props> = ({ followersCount }) => {
  return <div>
    <FormattedMessage
      id="followers-count"
      values={{
        count: <FormattedNumber value={followersCount as number} />
      }}
    />
  </div>
}

export default FollowersCount;