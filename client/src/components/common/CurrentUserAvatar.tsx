import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Avatar, Space } from 'antd';
import { selectCurrentUser } from "../../redux/selectors/users";
import SignOutButton from "../common/buttons/SignOutButton";

const CurrentUserAvatar: React.FC = () => {

  const currentUser = useSelector(selectCurrentUser);
  if (currentUser === null) {
    return <Fragment />;
  }
  const { id, login, photoUrl } = currentUser;

  return <Fragment>
    <NavLink to={"users/" + id}>
      <Space>
        {login}
        <Avatar size={48} src={photoUrl} />
      </Space>
    </NavLink>
    <SignOutButton />
  </Fragment>
}

export default CurrentUserAvatar;