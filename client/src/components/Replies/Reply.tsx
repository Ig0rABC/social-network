import React from "react";
import { Reply as ReplyType } from "../../types/models";

type Props = {
  reply: ReplyType,
  editMode: boolean,
  pendingLike: boolean,
  isAuthorized: boolean,
  currentUserId: number,
}

const Reply: React.FC<Props> = ({ reply, pendingLike, editMode, ...props }) => {

  const isOwn = props.currentUserId === reply.author.id;

  if (editMode) return <div>REPLY UPDATE FORM</div>

  return <div>
    REPLY
  </div>
}

export default Reply;