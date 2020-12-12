import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setIsFollowed } from "../../redux/thunks/users";
import { selectFollowingInProgress } from "../../redux/selectors/users";
import { User } from "../../types/models";

type Props = {
  user: User,
  isFollowed: boolean
}

const ToggleFollowButton: React.FC<Props> = ({ user, isFollowed }) => {

  const dispatch = useDispatch();
  const isFollowingInProgress = useSelector(selectFollowingInProgress);

  const handleClick = () => {
    dispatch(setIsFollowed(user, !isFollowed));
  }

  return <Button onClick={handleClick} disabled={isFollowingInProgress}>
    <FormattedMessage
      id={isFollowed ? "buttons.unfollow" : "buttons.follow"}
      defaultMessage={isFollowed ? "unfollow" : "follow"}
    />
  </Button>
}

export default ToggleFollowButton;