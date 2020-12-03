import React from "react";
import { List } from "antd";
import { Comment as CommentType } from "../../../types/models";
import Comment from "./Comment"

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
      onFinishCreatingComment: (values: any) => void,
      onFinishUpdatingComment: (commentId: number) => (values: any) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const Comments: React.FC<Props> = (props) => {

  const { comments, likeCommentsInProgress, editingCommentId, handlers, ...restProps } = props;

  return <List
    dataSource={props.comments}
    style={{ display: props.comments.length > 0 ? "inline" : "none" }}
    renderItem={comment => (
      <Comment comment={comment} {...restProps}
        editMode={comment.id === props.editingCommentId}
        likeInProgress={likeCommentsInProgress.includes(comment.id)}
        handlers={{
          comments: {
            onLikeCommentClick: handlers.comments.onLikeCommentClick(comment.id, comment.isLiked),
            onEditCommentClick: handlers.comments.onEditCommentClick(comment.id),
            onDeleteCommentClick: handlers.comments.onDeleteCommentClick(comment.id),
            onFinishCreatingComment: handlers.comments.onFinishCreatingComment,
            onFinishUpdatingComment: handlers.comments.onFinishUpdatingComment(comment.id)
          },
          common: {
            onUnauthorizedClick: handlers.common.onUnauthorizedClick
          }
        }}
      />
    )}
  />
}

export default Comments;