import React from "react";
import { useSelector } from "react-redux";
import { selectEditingReplyId, selectPendingLikeReplies, selectReplies } from "../../redux/selectors/public";
import Reply from "./Reply";

type Props = {
  commentId: number,
  isAuthorized: boolean,
  currentUserId: number,
}

const Replies: React.FC<Props> = ({ commentId, ...props }) => {

  const replies = useSelector(selectReplies(commentId));
  const editingReplyId = useSelector(selectEditingReplyId);
  const pendingLikes = useSelector(selectPendingLikeReplies);

  return <div>
    {replies.map(reply => (
      <Reply
        key={reply.id}
        reply={reply}
        editMode={reply.id === editingReplyId}
        pendingLike={pendingLikes.includes(reply.id)}
        {...props}
      />)
    )}
  </div>
}

export default Replies;