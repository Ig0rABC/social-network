import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List } from "antd";
import { selectFollowings } from "../redux/selectors/users";
import { requestFollowings } from "../redux/thunks/users";
import Following from "./Following";
import { FormattedMessage } from "react-intl";

const Followings: React.FC = () => {

  const dispatch = useDispatch();
  const followings = useSelector(selectFollowings);

  useEffect(() => {
    dispatch(requestFollowings());
  }, [])

  return <div>
    <FormattedMessage
      id="followings-count"
      values={{
        count: followings.length
      }}
    />
    <List
      size="small"
      itemLayout="horizontal"
      dataSource={followings}
      renderItem={following => <Following user={following} />}
    />
  </div>
}

export default Followings;