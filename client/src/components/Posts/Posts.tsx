import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { List, Form, Button } from 'antd';
import { selectEditingPostId, selectFilter, selectIsFetching, selectLikesInProgress, selectPosts, selectTotalPostsCount } from "../../redux/selectors/posts";
import { actions, createPost, deletePost, requestPosts, toggleIsLikedPost, updatePost } from "../../redux/reducers/posts";
import PostComponent from "./Post";
import PostsSearchForm from "./PostsSearchForm";
import { selectCurrentUser, selectIsAuthorized } from "../../redux/selectors/users";
import PostForm, { PostFormValues } from "./PostForm";

const Posts: React.FC = () => {

  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const posts = useSelector(selectPosts);
  const totalPostsCount = useSelector(selectTotalPostsCount);
  const isFetching = useSelector(selectIsFetching);
  const likesInProgress = useSelector(selectLikesInProgress);
  const isAuthorized = useSelector(selectIsAuthorized);
  const currentUser = useSelector(selectCurrentUser);
  const editingPostId = useSelector(selectEditingPostId);

  useEffect(() => {
    dispatch(requestPosts(filter));
  }, [filter])

  const handleLikeClick = (postId: number, isLiked: boolean) => () => {
    dispatch(toggleIsLikedPost(postId, isLiked));
  }

  const handleCommentsClick = (postId: number) => () => {
    console.log("POST COMMENTS");
  }

  const handleDeleteClick = (postId: number) => () => {
    dispatch(deletePost(postId));
  }

  const handleUnauthorizedClick = () => {
    console.log("ANUTHORIZED");
  }

  const onFinishCreatingPost = (values: PostFormValues) => {
    dispatch(createPost(values.category, values.content));
  }

  const onFinishUpdatingPost = (postId: number) => (values: PostFormValues) => {
    dispatch(updatePost(postId, values.category, values.content));
  }

  const handleCancelClick = () => {
    dispatch(actions.resetEditingPostId());
  }

  const pagination = {
    onChange: (page: number, pageSize: number | undefined) => {
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

  const cancelButton = (
    <Form.Item>
      <Button onClick={handleCancelClick}>
        <FormattedMessage id="buttons.cancel" defaultMessage="cancel" />
      </Button>
    </Form.Item>
  )

  return <>
    <PostForm onFinish={onFinishCreatingPost} />
    {/*<PostsSearchForm handleSearch={() => { }} isSubmitting={isFetching} />-*/}
    <List
      itemLayout="vertical"
      size="large"
      pagination={pagination}
      dataSource={posts}
      loading={isFetching}
      renderItem={post => {
        return (
          <PostComponent {...post}
            isAuthorized={isAuthorized}
            isOwn={currentUser.id === post.author.id}
            isSubmitting={likesInProgress.includes(post.id)}
            editMode={post.id === editingPostId}
            handleEditClick={() => dispatch(actions.setEditingPostId(post.id))}
            handleLikeClick={handleLikeClick(post.id, post.isLiked)}
            handleDeleteClick={handleDeleteClick(post.id)}
            handleCommentsClick={handleCommentsClick(post.id)}
            handleUnauthorizedClick={handleUnauthorizedClick}
            onFinish={onFinishUpdatingPost(post.id)}
            cancelButton={cancelButton}
          />
        )
      }
      }
    />
  </>
}

export default React.memo(Posts);