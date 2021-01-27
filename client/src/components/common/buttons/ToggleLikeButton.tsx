import React from "react";
import IconCount from "../IconCount";
import { LikeOutlined, LikeFilled } from '@ant-design/icons';

type Props = {
  isAuthorized: boolean,
  isLiked: boolean,
  likesCount: number,
  disabled: boolean,
  onClick: () => void,
  onUnauthorizedClick: () => void
}

const ToggleLikeButton: React.FC<Props> = ({ isAuthorized, isLiked, likesCount, disabled, onClick, onUnauthorizedClick }) => {
  return <IconCount
    icon={isLiked ? LikeFilled : LikeOutlined}
    count={likesCount}
    onClick={isAuthorized ? onClick : onUnauthorizedClick}
    messageId={isLiked ? "buttons.unlike" : "buttons.like"}
    defaultMessage={isLiked ? "unlike" : "like"}
    disabled={disabled}
  />
}

export default ToggleLikeButton;