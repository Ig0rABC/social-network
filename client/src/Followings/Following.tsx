import React from "react";
import { User } from "../types/models";
import AuthorAvatar from "../components/common/AuthorAvatar";

type Props = {
  user: User
}

const Following: React.FC<Props> = ({ user }) => {
  return <div>
    <AuthorAvatar {...user} />
    {user.login}
  </div>
}

export default Following;