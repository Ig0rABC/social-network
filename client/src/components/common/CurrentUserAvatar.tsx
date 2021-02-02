import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { selectCurrentUser } from "../../redux/selectors/users";
import SignOutButton from "./SignOutButton";

const CurrentUserAvatar: React.FC = () => {

  const currentUser = useSelector(selectCurrentUser);
  if (currentUser === null) {
    return <div />;
  }
  const { id, login, photoUrl } = currentUser;

  return <div>
    <NavLink to={"users/" + id}>
      {login}
      <Avatar src={photoUrl} />
    </NavLink>
    <SignOutButton />
  </div>
}

export default CurrentUserAvatar;