import React from "react";
import { Comment as AntdComment } from "antd";
import { Comment as CommentType } from "../../../types/models";
import actions from "../../../redux/actions/public";
import CommentForm from "./CommentForm";
import UserLink from "../../common/UserLink";
import AuthorAvatar from "../../common/AuthorAvatar";
import ToggleLikeButton from "../../common/ToggleLikeButton";
import ViewItemsButton from "../../common/ViewItemsButton";
import EditButton from "../../common/EditButton";
import DeleteButton from "../../common/DeleteButton";
import EditCancelButton from "../../common/EditCancelButton";

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
      onFinishUpdatingComment: (values: any) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const Comment: React.FC<Props> = (props) => {

  const { comment, handlers, editMode, likeInProgress, ...restProps } = props;
  const isOwn = props.currentUserId === comment.author.id;

  if (editMode) return (
    <CommentForm
      onFinish={handlers.comments.onFinishUpdatingComment}
      initialValues={{ content: comment.content }}
      extraElements={[<EditCancelButton onClick={actions.resetEditingCommentId} />]}
    />
  )

  return (
    <AntdComment key={comment.id}
      actions={[
        <ToggleLikeButton
          isAuthorized={props.isAuthorized}
          isLiked={comment.isLiked}
          likesCount={comment.likesCount}
          disabled={likeInProgress}
          onClick={handlers.comments.onLikeCommentClick}
          onUnauthorizedClick={handlers.common.onUnauthorizedClick}
        />,
        <ViewItemsButton
          itemsName="comments"
          itemsCount={comment.repliesCount}
          onClick={() => { }}
        />,
        isOwn && <EditButton onClick={handlers.comments.onEditCommentClick} />,
        isOwn && <DeleteButton onClick={handlers.comments.onDeleteCommentClick} />
      ]}
      author={<UserLink {...comment.author} />}
      avatar={<AuthorAvatar {...comment.author} />}
      content={comment.content}
      datetime={comment.created}
    />
  )
}

export default Comment;