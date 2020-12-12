import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const style = {
  color: "#717744",
  backgroundColor: "#eeffac"
}

type Props = {
  photoUrl: string | null
}

const ProfileAvatar: React.FC<Props> = ({ photoUrl }) => {
  return <Avatar size={96} src={photoUrl} icon={<UserOutlined />} style={style} />
}

export default ProfileAvatar;