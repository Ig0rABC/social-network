import React from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { selectFollowings } from "../../redux/selectors/users";
import Following from "./Following";

const Followings: React.FC = () => {

  const followings = useSelector(selectFollowings);

  return <div>
    <FormattedMessage
      id="followings-count"
      values={{
        count: followings.length
      }}
    />
    {followings.map(following => <Following user={following} />)}
  </div>
}

export default Followings;