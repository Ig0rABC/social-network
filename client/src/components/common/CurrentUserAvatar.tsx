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

  return (
    <NavLink to={"users/" + currentUser.id}>
      <Space>
        {currentUser.login}
        <Avatar size={48} src={currentUser.photoUrl} icon={<UserOutlined />} style={style} />
      </Space>
    </NavLink>
  )
}

export default CurrentUserAvatar;