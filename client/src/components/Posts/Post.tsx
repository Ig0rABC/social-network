import React from "react";
import { Comment } from "antd";
import { Post, Comment as CommentType, Reply } from "../../types/models";
import PostForm, { PostFormValues } from "./PostForm";
import { CommentFormValues } from "../Comments/CommentForm";
import AuthorAvatar from "../common/AuthorAvatar";
import UserLink from "../common/UserLink";
import Comments from "../Comments/Comments";
import ToggleLikeButton from "../common/buttons/ToggleLikeButton";
import ViewItemsButton from "../common/buttons/ViewItemsButton";
import EditButton from "../common/buttons/EditButton";
import DeleteButton from "../common/buttons/DeleteButton";
import EditCancelButton from "../common/buttons/EditCancelButton";
import { ReplyFormValues } from "../Replies/ReplyForm";

type Props = {
  post: Post,
  isAuthorized: boolean,
  currentUserId: number,
  editMode: boolean,
  comments: CommentType[],
  pendingLike: boolean,
  pendingLikeComments: number[],
  editingCommentId: number,
  openedComments: boolean,
  openedReplies: number[],
  replies: Reply[],
  editingReplyId: number,
  pendingLikeReplies: number[],
  handlers: {
    posts: {
      onLikeClick: () => void,
      onDeleteClick: () => void,
      onEditClick: () => void,
      onCancelEditingClick: () => void,
      onViewCommentsClick: () => void,
      onFinishUpdating: (values: PostFormValues) => void
    },
    comments: {
      onLikeClick: (commentId: number, isLiked: boolean) => () => void
      onDeleteClick: (commentId: number) => () => void,
      onEditClick: (commentId: number) => () => void,
      onCancelEditingClick: () => void,
      onFinishCreating: (postId: number) => (values: CommentFormValues) => void,
      onFinishUpdating: (commentId: number) => (values: CommentFormValues) => void
      onViewRepliesClick: (commentId: number) => () => void
    },
    replies: {
      onLikeClick: (replyId: number, isLiked: boolean) => () => void
      onDeleteClick: (replyId: number) => () => void,
      onEditClick: (replyId: number) => () => void,
      onCancelEditingClick: () => void,
      onFinishCreating: (commentId: number) =>(values: ReplyFormValues) => void,
      onFinishUpdating: (replyId: number) => (values: ReplyFormValues) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const PostComponent: React.FC<Props> = (props) => {

  const { post, handlers, editMode, pendingLike, ...restProps } = props;
  const isOwn = props.currentUserId === post.author.id;

  if (editMode) return (
    <PostForm key={post.id}
      onFinish={handlers.posts.onFinishUpdating}
      initialValues={{ category: post.category, content: post.content }}
      extraElements={[<EditCancelButton onClick={handlers.comments.onCancelEditingClick} />]}
    />
  )

  return (
    <Comment key={post.id}
      actions={[
        <ToggleLikeButton
          isAuthorized={props.isAuthorized}
          isLiked={post.isLiked}
          likesCount={post.likesCount}
          disabled={pendingLike}
          onClick={handlers.posts.onLikeClick}
          onUnauthorizedClick={handlers.common.onUnauthorizedClick}
        />,
        <ViewItemsButton
          itemsName="comments"
          itemsCount={post.commentsCount}
          onClick={handlers.posts.onViewCommentsClick}
        />,
        isOwn && <EditButton onClick={handlers.posts.onEditClick} />,
        isOwn && <DeleteButton onClick={handlers.posts.onDeleteClick} />
      ]}
      author={<UserLink {...post.author} />}
      avatar={<AuthorAvatar {...post.author} />}
      content={post.content}
      datetime={post.created}
    >
      <Comments {...restProps} handlers={{
        comments: {
          ...handlers.comments,
          onFinishCreating: handlers.comments.onFinishCreating(post.id)
        },
        replies: handlers.replies,
        common: handlers.common
      }}
      />
    </Comment>
  )
}

export default PostComponent;