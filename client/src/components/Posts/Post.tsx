import React, { useState } from "react";
import { List, Avatar, Space, Button, Tooltip } from 'antd';
import { MessageOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import { Post } from "../../types/models";
import { FormattedDate, FormattedMessage, FormattedNumber } from "react-intl";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/reducers/posts";
import postsAPI from "../../api/posts";

type Props = {
  icon: React.FC | "img",
  count: number,
  messageId: string,
  defaultMessage: string,
  isSubmitting?: boolean,
  onClick: () => void
}

const IconCount: React.FC<Props> = ({ icon, count, messageId, defaultMessage, isSubmitting, onClick }) => (
  <Space>
    <Tooltip title={<FormattedMessage id={messageId} defaultMessage={defaultMessage} />}>
      <Button type="link" onClick={onClick} disabled={isSubmitting}>
        {React.createElement(icon)}
      </Button>
    </Tooltip>
    <FormattedNumber
      value={count}
    />
  </Space>
);

const PostComponent: React.FC<{ post: Post }> = ({ post }) => {

  const dispatch = useDispatch();
  let [isSubmitting, setSubmitting] = useState(false);

  const handleLikeClick = async () => {
    setSubmitting(true);
    if (post.isLiked) {
      await postsAPI.unlikePost(post.id);
    } else {
      await postsAPI.likePost(post.id);
    }
    dispatch(actions.toggleIsLikedPost(post.id));
    setSubmitting(false);
  }

  const handleCommentsClick = () => {
    console.log("COMMENTS");
  }

  return (
    <List.Item
      key={post.id}
      actions={[
        <IconCount
          icon={post.isLiked ? LikeFilled : LikeOutlined}
          count={post.likesCount}
          onClick={handleLikeClick}
          messageId={post.isLiked ? "buttons.unlike" : "buttons.like"}
          defaultMessage={post.isLiked ? "unlike" : "like"}
          isSubmitting={isSubmitting}
        />,
        <IconCount
          icon={MessageOutlined}
          count={post.commentsCount}
          onClick={handleCommentsClick}
          messageId="buttons.view-comments"
          defaultMessage="view comments"
        />
      ]}
    >
      <List.Item.Meta
        title={<NavLink to={"/users/" + post.author.id}>{post.author.login}</NavLink>}
        avatar={<NavLink to={"/users/" + post.author.id}><Avatar src={post.author.photoUrl} /></NavLink>}
        description={
          <FormattedDate
            value={post.created}
            year="numeric"
            month="long"
            day="numeric"
          />
        }
      />
      {post.content}
    </List.Item>
  )
}

export default PostComponent;