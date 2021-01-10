import React from "react";
import { Comment } from "antd";
import { Reply as ReplyType } from "../../types/models";
import ToggleLikeButton from "../common/ToggleLikeButton";
import EditButton from "../common/EditButton";
import DeleteButton from "../common/DeleteButton";
import UserLink from "../common/UserLink";
import AuthorAvatar from "../common/AuthorAvatar";
import ReplyForm, { ReplyFormValues } from "./ReplyForm";
import EditCancelButton from "../common/EditCancelButton";

type Props = {
  isAuthorized: boolean,
  currentUserId: number,
  reply: ReplyType,
  editMode: boolean,
  pendingLike: boolean,
  handlers: {
    replies: {
      onLikeClick: () => void
      onDeleteClick: () => void,
      onEditClick: () => void,
      onCancelEditingClick: () => void,
      onFinishUpdating: (values: ReplyFormValues) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const Reply: React.FC<Props> = ({ isAuthorized, reply, handlers, pendingLike, currentUserId, editMode }) => {

  const isOwn = currentUserId === reply.author.id;

  if (editMode) return (
    <ReplyForm
      onFinish={handlers.replies.onFinishUpdating}
      initialValues={{ content: reply.content }}
      extraElements={[<EditCancelButton onClick={handlers.replies.onCancelEditingClick} />]}
    />
  )

  return (
    <Comment key={reply.id}
      actions={[
        <ToggleLikeButton
          isAuthorized={isAuthorized}
          isLiked={reply.isLiked}
          likesCount={reply.likesCount}
          disabled={pendingLike}
          onClick={handlers.replies.onLikeClick}
          onUnauthorizedClick={handlers.common.onUnauthorizedClick}
        />,
        isOwn && <EditButton onClick={handlers.replies.onEditClick} />,
        isOwn && <DeleteButton onClick={handlers.replies.onDeleteClick} />
      ]}
      author={<UserLink {...reply.author} />}
      avatar={<AuthorAvatar {...reply.author} />}
      content={reply.content}
      datetime={reply.created}
    />
  )
}

export default Reply;