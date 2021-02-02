import React, { Fragment } from "react";
import { User } from "../../types/models";

type Props = {
  user: User
}

const Following: React.FC<Props> = ({ user }) => {
  return <Fragment>
    <span>
      {user.login}
    </span>
  </Fragment>
}

export default Following;