import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toggleIsFollowed } from "../../redux/thunks/users";
import { selectFollowingInProgress } from "../../redux/selectors/users";

type Props = {
  userId: number,
  isFollowed: boolean
}

const ToggleFollowButton: React.FC<Props> = ({ userId, isFollowed }) => {

  const dispatch = useDispatch();
  const isFollowingInProgress = useSelector(selectFollowingInProgress);

  const handleClick = () => {
    dispatch(toggleIsFollowed(userId, isFollowed));
  }

  return <Button onClick={handleClick} disabled={isFollowingInProgress}>
    <FormattedMessage
      id={isFollowed ? "buttons.unfollow" : "buttons.follow"}
      defaultMessage={isFollowed ? "unfollow" : "follow"}
    />
  </Button>
}

export default ToggleFollowButton;