import React from "react";
import { List, Avatar, Space, Button, Tooltip } from 'antd';
import { MessageOutlined, LikeOutlined } from '@ant-design/icons';
import { Post } from "../../types/models";
import { FormattedDate, FormattedMessage, FormattedNumber } from "react-intl";
import { NavLink } from "react-router-dom";

const IconCount: React.FC<{
  icon: React.FC | "img", count: number, messageId: string, defaultMessage: string, onClick: () => void
}> = ({ icon, count, messageId, defaultMessage, onClick }) => (
  <Space>
    <Tooltip title={<FormattedMessage id={messageId} defaultMessage={defaultMessage} />}>
      <Button type="link" onClick={onClick}>
        {React.createElement(icon)}
      </Button>
    </Tooltip>
    <FormattedNumber
      value={count}
    />
  </Space>
);

const PostComponent: React.FC<{ post: Post }> = ({ post }) => {

  const handleLikeClick = () => {
    console.log("LIKE");
  }

  const handleCommentsClick = () => {
    console.log("COMMENTS");
  }

  return (
    <List.Item
      key={post.id}
      actions={[
        <IconCount
          icon={LikeOutlined}
          count={post.likesCount}
          onClick={handleLikeClick}
          messageId="buttons.like"
          defaultMessage="like"
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