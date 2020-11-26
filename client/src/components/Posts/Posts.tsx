import React, { useEffect, useState } from "react";
import { List } from 'antd';
import { Post } from "../../types/models";
import postsAPI from "../../api/posts";
import PostComponent from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { selectFilter, selectPosts, selectTotalPostsCount } from "../../redux/selectors/posts";
import { actions } from "../../redux/reducers/posts";
import PostsSearchForm from "./PostsSearchForm";
import { FormattedMessage, FormattedNumber } from "react-intl";

const Posts: React.FC = () => {

  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const posts = useSelector(selectPosts);
  const totalPostsCount = useSelector(selectTotalPostsCount);
  let [isSubmitting, setSubmitting] = useState(false);

  const requestPosts = async () => {
    const data = await postsAPI.getPosts(filter)
    dispatch(actions.setPosts(data.posts));
    dispatch(actions.setTotalPostsCount(data.totalCount));
  }

  useEffect(() => {
    requestPosts();
  }, [])

  useEffect(() => {
    requestPosts();
  }, [filter])

  const pagination = {
    onChange: async (page: number, pageSize: number | undefined) => {
      dispatch(actions.setFilter({ ...filter, page, pageSize: pageSize as number }));
    },
    showTotal: (total: number, range: number[]) => (
      <FormattedMessage id="total-posts-count"
        values={{
          ...range,
          total: <FormattedNumber value={total} />
        }}
      />),
    total: totalPostsCount as number,
    current: filter.page,
    pageSize: filter.pageSize,
    disabled: isSubmitting,
  }

  return <>
    <PostsSearchForm handleSearch={() => { }} isSubmitting={false} />
    <List
      itemLayout="vertical"
      size="large"
      pagination={pagination}
      dataSource={posts}
      renderItem={
        (post: Post) => <PostComponent post={post} />
      }
    />
  </>
}

export default Posts;