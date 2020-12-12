import React from "react";
import { List } from "antd";
import { Comment as CommentType, Reply } from "../../../types/models";
import Comment from "./Comment"
import CommentForm, { CommentFormValues } from "./CommentForm";
import { ReplyFormValues } from "./Replies/ReplyForm";

type Props = {
  isAuthorized: boolean,
  currentUserId: number,
  comments: CommentType[],
  editingCommentId: number,
  likeCommentsInProgress: number[],
  commentsWithOpenedReplies: number[],
  openedComments: boolean,
  replies: Reply[],
  editingReplyId: number,
  likeRepliesInProgress: number[],
  handlers: {
    comments: {
      onLikeClick: (commentId: number, isLiked: boolean) => () => void
      onEditClick: (commentId: number) => () => void,
      onDeleteClick: (commentId: number) => () => void,
      onFinishCreating: (values: CommentFormValues) => void,
      onFinishUpdating: (commentId: number) => (values: CommentFormValues) => void,
      onViewRepliesClick: (commentId: number) => () => void
    },
    replies: {
      onLikeClick: (replyId: number, isLiked: boolean) => () => void
      onEditClick: (replyId: number) => () => void,
      onDeleteClick: (replyId: number) => () => void,
      onFinishCreating: (commentId: number) => (values: ReplyFormValues) => void,
      onFinishUpdating: (replyId: number) => (values: ReplyFormValues) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const Comments: React.FC<Props> = (props) => {

  const { comments, likeCommentsInProgress, editingCommentId, handlers, openedComments, commentsWithOpenedReplies, ...restProps } = props;
  const isEmpty = comments.length === 0;

  return <div>
    {openedComments && <CommentForm onFinish={handlers.comments.onFinishCreating} />}
    <List
      itemLayout="horizontal"
      size="default"
      dataSource={comments}
      locale={{
        emptyText: <div />
      }}
      style={{ display: isEmpty ? "none" : "inline" }}
      renderItem={comment => (
        <Comment comment={comment} {...restProps}
          editMode={comment.id === editingCommentId}
          likeInProgress={likeCommentsInProgress.includes(comment.id)}
          openedReplies={commentsWithOpenedReplies.includes(comment.id)}
          handlers={{
            comments: {
              onLikeClick: handlers.comments.onLikeClick(comment.id, comment.isLiked),
              onEditClick: handlers.comments.onEditClick(comment.id),
              onDeleteClick: handlers.comments.onDeleteClick(comment.id),
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