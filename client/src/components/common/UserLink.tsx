import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "../../types/models";

const UserLink: React.FC<User> = ({ id, login }) => {
  return <NavLink to={"/users/" + id}>{login}</NavLink>
}

export default UserLink;