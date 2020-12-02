import React from "react";
import { Comment } from "antd";
import { Post } from "../../types/models";
import PostForm, { PostFormValues } from "./PostForm";
import PostEditCancelButton from "./PostEditCancelButton";
import EditAndDeleteButtons from "../common/EditAndDeleteButtons";
import LikeAndCommentsButtons from "../common/LikeAndCommentsButtons";
import AuthorAvatar from "../common/AuthorAvatar";
import UserLink from "../common/UserLink";

type Props = Post & {
  isAuthorized: boolean,
  isSubmitting: boolean,
  isOwn: boolean,
  editMode: boolean,
  onEditClick: () => void,
  onDeleteClick: () => void,
  onLikeClick: () => void,
  onCommentsClick: () => void,
  onUnauthorizedClick: () => void,
  onFinish: (values: PostFormValues) => void
}

const PostComponent: React.FC<Props> = ({ isAuthorized, id, category, author, content, created, isLiked, likesCount, commentsCount, isSubmitting, isOwn, editMode, onDeleteClick, onEditClick, onLikeClick, onCommentsClick, onUnauthorizedClick, onFinish }) => {

  if (editMode) {
    return <PostForm key={id} onFinish={onFinish} initialValues={{ category, content }} extraElements={[<PostEditCancelButton />]} />
  }

  return <Comment key={id}
    actions={[
      <LikeAndCommentsButtons
        isAuthorized={isAuthorized}
        isLiked={isLiked}
        likesCount={likesCount}
        commentsCount={commentsCount}
        disabled={isSubmitting}
        onLikeClick={onLikeClick}
        onCommentsClick={onCommentsClick}
        onUnauthorizedClick={onUnauthorizedClick}
      />,
      isOwn && <EditAndDeleteButtons
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    ]}
    author={<UserLink {...author}/>}
    avatar={<AuthorAvatar {...author} />}
    content={content}
    datetime={created}
  >
  </Comment>
}

export default PostComponent;