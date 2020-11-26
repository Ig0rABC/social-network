import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { List } from 'antd';
import { Post } from "../../types/models";
import { selectFilter, selectIsFetching, selectLikesInProgress, selectPosts, selectTotalPostsCount } from "../../redux/selectors/posts";
import { actions, requestPosts } from "../../redux/reducers/posts";
import PostComponent from "./Post";
import PostsSearchForm from "./PostsSearchForm";

const Posts: React.FC = () => {

  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const posts = useSelector(selectPosts);
  const totalPostsCount = useSelector(selectTotalPostsCount);
  const isFetching = useSelector(selectIsFetching);
  const likesInProgress = useSelector(selectLikesInProgress);

  useEffect(() => {
    dispatch(requestPosts(filter));
  }, [])

  useEffect(() => {
    dispatch(requestPosts(filter));
  }, [filter])

  const pagination = {
    onChange: async (page: number, pageSize: number | undefined) => {
      dispatch(actions.setFilter({
        ...filter,
        page,
        pageSize: pageSize as number
      }));
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
    disabled: isFetching,
  }

  return <>
    <PostsSearchForm handleSearch={() => { }} isSubmitting={isFetching} />
    <List
      itemLayout="vertical"
      size="large"
      pagination={pagination}
      dataSource={posts}
      renderItem={
        (post: Post) => <PostComponent post={post} isSubmitting={likesInProgress.includes(post.id)} />
      }
    />
  </>
}

export default React.memo(Posts);