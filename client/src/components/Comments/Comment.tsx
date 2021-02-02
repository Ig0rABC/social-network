import React from "react";
import { Comment as CommentType } from "../../types/models";

type Props = {
  comment: CommentType,
  editMode: boolean,
  pendingLike: boolean,
  openedReplies: boolean,
  isAuthorized: boolean,
  currentUserId: number,
}

const Comment: React.FC<Props> = ({ comment, editMode, pendingLike, ...props }) => {

  const isOwn = props.currentUserId === comment.author.id;

  if (editMode) return <div>COMMENT UPDATE FORM</div>

  return <div>COMMENT</div>
}

export default Comment;