import React from "react";
import { Comment as AntdComment } from "antd";
import { Comment as CommentType, Reply } from "../../../types/models";
import actions from "../../../redux/actions/public";
import CommentForm, { CommentFormValues } from "./CommentForm";
import UserLink from "../../common/UserLink";
import AuthorAvatar from "../../common/AuthorAvatar";
import ToggleLikeButton from "../../common/ToggleLikeButton";
import ViewItemsButton from "../../common/ViewItemsButton";
import EditButton from "../../common/EditButton";
import DeleteButton from "../../common/DeleteButton";
import EditCancelButton from "../../common/EditCancelButton";
import Replies from "./Replies/Replies";
import { ReplyFormValues } from "./Replies/ReplyForm";

type Props = {
  comment: CommentType,
  isAuthorized: boolean,
  currentUserId: number,
  editMode: boolean,
  likeInProgress: boolean,
  replies: Reply[],
  editingReplyId: number,
  likeRepliesInProgress: number[],
  openedReplies: boolean,
  handlers: {
    comments: {
      onLikeClick: () => void
      onEditClick: () => void,
      onDeleteClick: () => void,
      onFinishUpdating: (values: CommentFormValues) => void,
      onViewRepliesClick: () => void
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

const Comment: React.FC<Props> = (props) => {

  const { comment, handlers, editMode, likeInProgress, ...restProps } = props;
  const isOwn = props.currentUserId === comment.author.id;

  if (editMode) return (
    <CommentForm
      onFinish={handlers.comments.onFinishUpdating}
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
          onClick={handlers.comments.onLikeClick}
          onUnauthorizedClick={handlers.common.onUnauthorizedClick}
        />,
        <ViewItemsButton
          itemsName="replies"
          itemsCount={comment.repliesCount}
          onClick={handlers.comments.onViewRepliesClick}
        />,
        isOwn && <EditButton onClick={handlers.comments.onEditClick} />,
        isOwn && <DeleteButton onClick={handlers.comments.onDeleteClick} />
      ]}
      author={<UserLink {...comment.author} />}
      avatar={<AuthorAvatar {...comment.author} />}
      content={comment.content}
      datetime={comment.created}
    >
      <Replies {...restProps} handlers={{
        replies: {
          ...handlers.replies,
          onFinishCreating: handlers.replies.onFinishCreating(comment.id)
        },
        common: handlers.common
      }} />
    </AntdComment>
  )
}

export default Comment;