import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { selectCurrentUser } from "../../redux/selectors/users";

const style = {
  color: "#717744",
  backgroundColor: "#eeffac"
}

const CurrentUserAvatar: React.FC = () => {

  const currentUser = useSelector(selectCurrentUser);
  if (currentUser === null) {
    return <Avatar size={48} icon={<UserOutlined />} style={style} />
  }
  const { id, login, photoUrl } = currentUser;

  return (
    <NavLink to={"users/" + id}>
      <Space>
        {login}
        <Avatar size={48} src={photoUrl} />
      </Space>
    </NavLink>
  )
}

export default CurrentUserAvatar;