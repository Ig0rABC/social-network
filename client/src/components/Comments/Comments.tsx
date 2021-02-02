import React from "react";
import { useSelector } from "react-redux";
import {
  selectComments, selectEditingCommentId,
  selectOpenedReplies, selectPendingLikeComments
} from "../../redux/selectors/public";
import Comment from "./Comment";

type Props = {
  postId: number,
  isAuthorized: boolean,
  currentUserId: number
}

const Comments: React.FC<Props> = ({ postId, ...props }) => {

  const comments = useSelector(selectComments(postId))
  const editingCommentId = useSelector(selectEditingCommentId);
  const pendingLikes = useSelector(selectPendingLikeComments);
  const openedReplies = useSelector(selectOpenedReplies);

  return <div>
    {
      comments.map(c => <Comment key={c.id} comment={c}
        editMode={c.id === editingCommentId}
        openedReplies={openedReplies.includes(c.id)}
        pendingLike={pendingLikes.includes(c.id)}
        {...props}
      />)
    }
  </div>
}

export default Comments;