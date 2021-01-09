import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { List } from "antd";
import { selectFollowings } from "../../redux/selectors/users";
import Following from "./Following";

const Followings: React.FC = () => {

  const followings = useSelector(selectFollowings);

  return <Fragment>
    <FormattedMessage
      id="followings-count"
      values={{
        count: followings.length
      }}
    />
    <List
      size="small"
      itemLayout="horizontal"
      locale={{
        emptyText: <Fragment />
      }}
      dataSource={followings}
      renderItem={following => <Following user={following} />}
    />
  </Fragment>
}

export default Followings;