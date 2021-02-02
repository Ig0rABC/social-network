import { Avatar } from "@material-ui/core";
import React from "react";

type Props = {
  photoUrl: string | null
}

const ProfileAvatar: React.FC<Props> = ({ photoUrl }) => {
  return <Avatar src={photoUrl || undefined} />
}

export default ProfileAvatar;