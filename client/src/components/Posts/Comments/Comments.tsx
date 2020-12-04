import React from "react";
import { List } from "antd";
import { Comment as CommentType } from "../../../types/models";
import Comment from "./Comment"
import CommentForm, { CommentFormValues } from "./CommentForm";

type Props = {
  isAuthorized: boolean,
  currentUserId: number,
  comments: CommentType[],
  editingCommentId: number,
  likeCommentsInProgress: number[],
  handlers: {
    comments: {
      onLikeCommentClick: (commentId: number, isLiked: boolean) => () => void
      onEditCommentClick: (commentId: number) => () => void,
      onDeleteCommentClick: (commentId: number) => () => void,
      onFinishCreatingComment: (values: CommentFormValues) => void,
      onFinishUpdatingComment: (commentId: number) => (values: CommentFormValues) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const Comments: React.FC<Props> = (props) => {

  const { comments, likeCommentsInProgress, editingCommentId, handlers, ...restProps } = props;
  const isEmpty = comments.length === 0;

  return <div>
    {!isEmpty && <CommentForm onFinish={handlers.comments.onFinishCreatingComment} />}
    <List
      itemLayout="horizontal"
      size="default"
      dataSource={props.comments}
      style={{ display: isEmpty ? "none" : "inline" }}
      renderItem={comment => (
        <Comment comment={comment} {...restProps}
          editMode={comment.id === props.editingCommentId}
          likeInProgress={likeCommentsInProgress.includes(comment.id)}
          handlers={{
            comments: {
              onLikeCommentClick: handlers.comments.onLikeCommentClick(comment.id, comment.isLiked),
              onEditCommentClick: handlers.comments.onEditCommentClick(comment.id),
              onDeleteCommentClick: handlers.comments.onDeleteCommentClick(comment.id),
              onFinishUpdatingComment: handlers.comments.onFinishUpdatingComment(comment.id)
            },
            common: {
              onUnauthorizedClick: handlers.common.onUnauthorizedClick
            }
          }}
        />
      )}
    />
  </div>
}

export default Comments;