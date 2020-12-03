import React from "react";
import { Comment as AntdComment } from "antd";
import { Comment as CommentType } from "../../../types/models";
import UserLink from "../../common/UserLink";
import AuthorAvatar from "../../common/AuthorAvatar";

type Props = {
  comment: CommentType,
  isAuthorized: boolean,
  currentUserId: number,
  editMode: boolean,
  likeInProgress: boolean,
  handlers: {
    comments: {
      onLikeCommentClick: () => void
      onEditCommentClick: () => void,
      onDeleteCommentClick: () => void,
      onFinishCreatingComment: (values: any) => void,
      onFinishUpdatingComment: (values: any) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const Comment: React.FC<Props> = (props) => {

  const { comment, editMode, likeInProgress, ...restProps } = props;

  if (editMode) return (<div></div>)

  return (
    <AntdComment key={comment.id}
      author={<UserLink {...comment.author} />}
      avatar={<AuthorAvatar {...comment.author} />}
      content={comment.content}
      datetime={comment.created}
    />
  )
}

export default Comment;