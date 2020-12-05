import React from "react";
import { Comment } from "antd";
import { Post, Comment as CommentType, Reply } from "../../types/models";
import actions from "../../redux/actions/public";
import PostForm, { PostFormValues } from "./PostForm";
import { CommentFormValues } from "./Comments/CommentForm";
import AuthorAvatar from "../common/AuthorAvatar";
import UserLink from "../common/UserLink";
import Comments from "./Comments/Comments";
import ToggleLikeButton from "../common/ToggleLikeButton";
import ViewItemsButton from "../common/ViewItemsButton";
import EditButton from "../common/EditButton";
import DeleteButton from "../common/DeleteButton";
import EditCancelButton from "../common/EditCancelButton";
import { ReplyFormValues } from "./Comments/Replies/ReplyForm";

type Props = {
  post: Post,
  isAuthorized: boolean,
  currentUserId: number,
  editMode: boolean,
  comments: CommentType[],
  likeInProgress: boolean,
  likeCommentsInProgress: number[],
  editingCommentId: number,
  openedComments: boolean,
  commentsWithOpenedReplies: number[],
  replies: Reply[],
  editingReplyId: number,
  likeRepliesInProgress: number[],
  handlers: {
    posts: {
      onLikeClick: () => void,
      onEditClick: () => void,
      onDeleteClick: () => void,
      onViewCommentsClick: () => void,
      onFinishUpdating: (values: PostFormValues) => void,
    },
    comments: {
      onLikeClick: (commentId: number, isLiked: boolean) => () => void
      onEditClick: (commentId: number) => () => void,
      onDeleteClick: (commentId: number) => () => void,
      onFinishCreating: (postId: number) => (values: CommentFormValues) => void,
      onFinishUpdating: (commentId: number) => (values: CommentFormValues) => void
      onViewRepliesClick: (commentId: number) => () => void
    },
    replies: {
      onLikeClick: (replyId: number, isLiked: boolean) => () => void
      onEditClick: (replyId: number) => () => void,
      onDeleteClick: (replyId: number) => () => void,
      onFinishCreating: (commentId: number) =>(values: ReplyFormValues) => void,
      onFinishUpdating: (replyId: number) => (values: ReplyFormValues) => void
    },
    common: {
      onUnauthorizedClick: () => void,
    }
  }
}

const PostComponent: React.FC<Props> = (props) => {

  const { post, handlers, editMode, likeInProgress, ...restProps } = props;
  const isOwn = props.currentUserId === post.author.id;

  if (editMode) return (
    <PostForm key={post.id}
      onFinish={handlers.posts.onFinishUpdating}
      initialValues={{ category: post.category, content: post.content }}
      extraElements={[<EditCancelButton onClick={actions.resetEditingPostId} />]}
    />
  )

  return (
    <Comment key={post.id}
      actions={[
        <ToggleLikeButton
          isAuthorized={props.isAuthorized}
          isLiked={post.isLiked}
          likesCount={post.likesCount}
          disabled={likeInProgress}
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