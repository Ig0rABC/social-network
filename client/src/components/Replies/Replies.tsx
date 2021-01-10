import React from "react";
import { List } from "antd";
import { Reply as ReplyType } from "../../types/models";
import Reply from "./Reply";
import ReplyForm, { ReplyFormValues } from "./ReplyForm";

type Props = {
  isAuthorized: boolean,
  currentUserId: number,
  replies: ReplyType[],
  editingReplyId: number,
  pendingLikeReplies: number[],
  openedReplies: boolean,
  handlers: {
    replies: {
      onLikeClick: (replyId: number, isLiked: boolean) => () => void
      onDeleteClick: (replyId: number) => () => void,
      onEditClick: (replyId: number) => () => void,
      onCancelEditingClick: () => void,
      onFinishCreating: (values: ReplyFormValues) => void,
      onFinishUpdating: (replyId: number) => (values: ReplyFormValues) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const Replies: React.FC<Props> = (props) => {

  const { replies, handlers, openedReplies, pendingLikeReplies, ...restProps } = props;
  const isEmpty = replies.length === 0;

  return <div>
    {openedReplies && <ReplyForm onFinish={handlers.replies.onFinishCreating} />}
    <List
      itemLayout="horizontal"
      size="default"
      dataSource={replies}
      locale={{
        emptyText: <div />
      }}
      style={{ display: isEmpty ? "none" : "inline" }}
      renderItem={reply => (
        <Reply reply={reply} {...restProps}
          editMode={reply.id === props.editingReplyId}
          pendingLike={pendingLikeReplies.includes(reply.id)}
          handlers={{
            replies: {
              onLikeClick: handlers.replies.onLikeClick(reply.id, reply.isLiked),
              onDeleteClick: handlers.replies.onDeleteClick(reply.id),
              onEditClick: handlers.replies.onEditClick(reply.id),
              onCancelEditingClick: handlers.replies.onCancelEditingClick,
              onFinishUpdating: handlers.replies.onFinishUpdating(reply.id)
            },
            common: {
              ...handlers.common
            }
          }}
        />
      )}
    />
  </div>
}

export default Replies;