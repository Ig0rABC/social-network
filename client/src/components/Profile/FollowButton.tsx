import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Button } from "antd";
import { setIsFollowed } from "../../redux/thunks/users";
import { selectPendingFollowing } from "../../redux/selectors/users";
import { User } from "../../types/models";

type Props = {
  user: User | null,
  isFollowed: boolean
}

const FollowButton: React.FC<Props> = ({ user, isFollowed }) => {

  const dispatch = useDispatch();
  const pendingFollowing = useSelector(selectPendingFollowing);

  const handleClick = () => {
    if (user === null) {
      return;
    }
    dispatch(setIsFollowed({user, isFollowed: !isFollowed}));
}

return <Button onClick={handleClick} disabled={pendingFollowing}>
  <FormattedMessage
    id={isFollowed ? "buttons.unfollow" : "buttons.follow"}
    defaultMessage={isFollowed ? "unfollow" : "follow"}
  />
</Button>
}

export default FollowButton;