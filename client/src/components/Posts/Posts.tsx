import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { List } from 'antd';
import { selectEditingPostId, selectFilter, selectIsFetching, selectLikesInProgress, selectPosts, selectTotalPostsCount } from "../../redux/selectors/posts";
import { actions, createPost, deletePost, requestPosts, requestShiftedPost, setFilter, toggleIsLikedPost, updatePost } from "../../redux/reducers/posts";
import PostComponent from "./Post";
import PostsSearchForm from "./PostsSearchForm";
import { selectCurrentUser, selectIsAuthorized } from "../../redux/selectors/users";
import PostForm, { PostFormValues } from "./PostForm";

type Props = {
  authorId?: number
}

const Posts: React.FC<Props> = ({ authorId }) => {

  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const posts = useSelector(selectPosts);
  const totalPostsCount = useSelector(selectTotalPostsCount) as number;
  const isFetching = useSelector(selectIsFetching);
  const likesInProgress = useSelector(selectLikesInProgress);
  const isAuthorized = useSelector(selectIsAuthorized);
  const currentUser = useSelector(selectCurrentUser);
  const editingPostId = useSelector(selectEditingPostId);
  const pagesCount = Math.ceil(totalPostsCount / filter.pageSize);

  useEffect(() => {
    dispatch(requestPosts(filter));
  }, [])

  if (!isFetching &&
    posts.length > 0 &&
    posts.length < filter.pageSize &&
    filter.page < pagesCount) {
    dispatch(requestShiftedPost(filter));
  }

  const handleLikeClick = (postId: number, isLiked: boolean) => () => {
    dispatch(toggleIsLikedPost(postId, isLiked));
  }

  const handleCommentsClick = (postId: number) => () => {
    console.log("POST COMMENTS", postId);
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

  const pagination = {
    onChange: (page: number, pageSize: number | undefined) => {
      dispatch(setFilter({
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
      />
    ),
    total: totalPostsCount,
    current: filter.page,
    pageSize: filter.pageSize,
    disabled: isFetching,
  }

  return <>
    {
      isAuthorized && (authorId === null || currentUser.id === authorId)
        ? <PostForm onFinish={onFinishCreatingPost} />
        : undefined
    }
    <PostsSearchForm authorId={authorId} isSubmitting={isFetching} />
    <List
      itemLayout="vertical"
      size="large"
      dataSource={posts}
      pagination={pagination}
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
          />
        )
      }
      }
    />
  </>
}

export default React.memo(Posts);