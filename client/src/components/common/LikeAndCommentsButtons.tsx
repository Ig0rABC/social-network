import React from "react";
import { Space } from "antd";
import IconCount from "./IconCount";
import { MessageOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';

type Props = {
  isAuthorized: boolean,
  isLiked: boolean,
  likesCount: number,
  commentsCount: number,
  disabled: boolean,
  onLikeClick: () => void,
  onCommentsClick: () => void,
  onUnauthorizedClick: () => void
}

const LikeAndCommentsButtons: React.FC<Props> = ({ isAuthorized, isLiked, likesCount, commentsCount, disabled, onLikeClick, onCommentsClick, onUnauthorizedClick }) => {
  return <Space>
    <IconCount
      icon={isLiked ? LikeFilled : LikeOutlined}
      count={likesCount}
      onClick={isAuthorized ? onLikeClick : onUnauthorizedClick}
      messageId={isLiked ? "buttons.unlike" : "buttons.like"}
      defaultMessage={isLiked ? "unlike" : "like"}
      disabled={disabled}
    />,
      <IconCount
      icon={MessageOutlined}
      count={commentsCount}
      onClick={isAuthorized ? onCommentsClick : onUnauthorizedClick}
      messageId="buttons.view-comments"
      defaultMessage="view comments"
    />
  </Space>
}

export default LikeAndCommentsButtons;