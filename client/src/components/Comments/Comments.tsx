import React, { Fragment } from "react";
import { List } from "antd";
import { Comment as CommentType, Reply } from "../../types/models";
import Comment from "./Comment"
import CommentForm, { CommentFormValues } from "./CommentForm";
import { ReplyFormValues } from "../Replies/ReplyForm";

type Props = {
  isAuthorized: boolean,
  currentUserId: number,
  comments: CommentType[],
  editingCommentId: number,
  pendingLikeComments: number[],
  openedReplies: number[],
  openedComments: boolean,
  replies: Reply[],
  editingReplyId: number,
  pendingLikeReplies: number[],
  handlers: {
    comments: {
      onLikeClick: (commentId: number, isLiked: boolean) => () => void
      onDeleteClick: (commentId: number) => () => void,
      onEditClick: (commentId: number) => () => void,
      onCancelEditingClick: () => void,
      onFinishCreating: (values: CommentFormValues) => void,
      onFinishUpdating: (commentId: number) => (values: CommentFormValues) => void,
      onViewRepliesClick: (commentId: number) => () => void
    },
    replies: {
      onLikeClick: (replyId: number, isLiked: boolean) => () => void
      onDeleteClick: (replyId: number) => () => void,
      onEditClick: (replyId: number) => () => void,
      onCancelEditingClick: () => void,
      onFinishCreating: (commentId: number) => (values: ReplyFormValues) => void,
      onFinishUpdating: (replyId: number) => (values: ReplyFormValues) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const Comments: React.FC<Props> = (props) => {

  const { comments, pendingLikeComments, editingCommentId, handlers, openedComments, openedReplies, ...restProps } = props;
  const isEmpty = comments.length === 0;

  return <div>
    {openedComments && <CommentForm onFinish={handlers.comments.onFinishCreating} />}
    <List
      itemLayout="horizontal"
      size="default"
      dataSource={comments}
      locale={{
        emptyText: <Fragment />
      }}
      style={{ display: isEmpty ? "none" : "inline" }}
      renderItem={comment => (
        <Comment comment={comment} {...restProps}
          editMode={comment.id === editingCommentId}
          pendingLike={pendingLikeComments.includes(comment.id)}
          openedReplies={openedReplies.includes(comment.id)}
          handlers={{
            comments: {
              onLikeClick: handlers.comments.onLikeClick(comment.id, comment.isLiked),
              onDeleteClick: handlers.comments.onDeleteClick(comment.id),
              onEditClick: handlers.comments.onEditClick(comment.id),
              onCancelEditingClick: handlers.comments.onCancelEditingClick,
              onFinishUpdating: handlers.comments.onFinishUpdating(comment.id),
              onViewRepliesClick: handlers.comments.onViewRepliesClick(comment.id)
            },
            replies: handlers.replies,
            common: {
              ...handlers.common
            }
          }}
        />
      )}
    />
  </div>
}

export default Comments;