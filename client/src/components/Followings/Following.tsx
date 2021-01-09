import React, { Fragment } from "react";
import { User } from "../../types/models";
import AuthorAvatar from "../common/AuthorAvatar";

type Props = {
  user: User
}

const Following: React.FC<Props> = ({ user }) => {
  return <Fragment>
    <AuthorAvatar {...user} />
    <span>
      {user.login}
    </span>
  </Fragment>
}

export default Following;