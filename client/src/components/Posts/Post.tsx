import React from "react";
import { Comment } from "antd";
import { Post, Comment as CommentType } from "../../types/models";
import actions from "../../redux/actions/public";
import PostForm, { PostFormValues } from "./PostForm";
import AuthorAvatar from "../common/AuthorAvatar";
import UserLink from "../common/UserLink";
import Comments from "./Comments/Comments";
import ToggleLikeButton from "../common/ToggleLikeButton";
import ViewItemsButton from "../common/ViewItemsButton";
import EditButton from "../common/EditButton";
import DeleteButton from "../common/DeleteButton";
import EditCancelButton from "../common/EditCancelButton";

type Props = {
  post: Post,
  isAuthorized: boolean,
  currentUserId: number,
  editMode: boolean,
  comments: CommentType[],
  likeInProgress: boolean,
  likeCommentsInProgress: number[],
  editingCommentId: number,
  handlers: {
    posts: {
      onLikePostClick: () => void,
      onEditPostClick: () => void,
      onDeletePostClick: () => void,
      onViewCommentsClick: () => void,
      onFinishCreatingPost: (values: PostFormValues) => void,
      onFinishUpdatingPost: (values: PostFormValues) => void,
    },
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

const PostComponent: React.FC<Props> = (props) => {

  const { post, handlers, editMode, likeInProgress, ...restProps } = props;
  const isOwn = props.currentUserId === post.author.id;

  if (editMode) return (
    <PostForm key={post.id}
      onFinish={handlers.posts.onFinishUpdatingPost}
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
          onClick={handlers.posts.onLikePostClick}
          onUnauthorizedClick={handlers.common.onUnauthorizedClick}
        />,
        <ViewItemsButton
          itemsName="comments"
          itemsCount={post.commentsCount}
          onClick={handlers.posts.onViewCommentsClick}
        />,
        isOwn && <EditButton onClick={handlers.posts.onEditPostClick} />,
        isOwn && <DeleteButton onClick={handlers.posts.onDeletePostClick} />
      ]}
      author={<UserLink {...post.author} />}
      avatar={<AuthorAvatar {...post.author} />}
      content={post.content}
      datetime={post.created}
    >
      <Comments {...restProps} handlers={{
        comments: handlers.comments,
        common: handlers.common
      }}
      />
    </Comment>
  )
}

export default PostComponent;