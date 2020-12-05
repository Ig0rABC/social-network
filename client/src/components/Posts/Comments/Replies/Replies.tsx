import React from "react";
import { List } from "antd";
import { Reply as ReplyType } from "../../../../types/models";
import Reply from "./Reply";
import ReplyForm, { ReplyFormValues } from "./ReplyForm";

type Props = {
  isAuthorized: boolean,
  currentUserId: number,
  replies: ReplyType[],
  editingReplyId: number,
  likeRepliesInProgress: number[],
  openedReplies: boolean,
  handlers: {
    replies: {
      onLikeClick: (replyId: number, isLiked: boolean) => () => void
      onEditClick: (replyId: number) => () => void,
      onDeleteClick: (replyId: number) => () => void,
      onFinishCreating: (values: ReplyFormValues) => void,
      onFinishUpdating: (replyId: number) => (values: ReplyFormValues) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const Replies: React.FC<Props> = (props) => {

  const { replies, handlers, openedReplies, likeRepliesInProgress, ...restProps } = props;
  const isEmpty = replies.length === 0;

  return <div>
    {openedReplies && <ReplyForm onFinish={handlers.replies.onFinishCreating} />}
    <List
      itemLayout="horizontal"
      size="default"
      dataSource={replies}
      style={{ display: isEmpty ? "none" : "inline" }}
      renderItem={reply => (
        <Reply reply={reply} {...restProps}
          editMode={reply.id === props.editingReplyId}
          likeInProgress={likeRepliesInProgress.includes(reply.id)}
          handlers={{
            replies: {
              onLikeClick: handlers.replies.onLikeClick(reply.id, reply.isLiked),
              onEditClick: handlers.replies.onEditClick(reply.id),
              onDeleteClick: handlers.replies.onDeleteClick(reply.id),
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