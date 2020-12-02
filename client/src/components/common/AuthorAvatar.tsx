import React from "react";
import { NavLink } from "react-router-dom";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { User } from "../../types/models";

const style = {
  color: "#717744",
  backgroundColor: "#eeffac"
}

const AuthorAvatar: React.FC<User> = ({ id, photoUrl }) => {
  return <NavLink to={"/users/" + id}>
    <Avatar size={48} src={photoUrl} icon={<UserOutlined />} style={style} />
  </NavLink>
}

export default AuthorAvatar;