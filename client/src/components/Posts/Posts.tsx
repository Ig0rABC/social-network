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
  isOwnPosts: boolean
}

const Posts: React.FC<Props> = ({ isOwnPosts }) => {

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
    if (!isOwnPosts) {
      dispatch(requestPosts(filter));
    }
  }, [])

  if (!isFetching &&
    posts.length > 0 &&
    posts.length < filter.pageSize &&
    filter.page < pagesCount) {
    dispatch(requestShiftedPost(filter));
  }

  const onLikeClick = (postId: number, isLiked: boolean) => () => {
    dispatch(toggleIsLikedPost(postId, isLiked));
  }

  const onCommentsClick = (postId: number) => () => {
    console.log("POST COMMENTS", postId);
  }

  const onDeleteClick = (postId: number) => () => {
    dispatch(deletePost(postId));
  }

  const onUnauthorizedClick = () => {
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

  return <div>
    {isOwnPosts && <PostForm onFinish={onFinishCreatingPost} />}
    <PostsSearchForm isSubmitting={isFetching} />
    <List
      itemLayout="vertical"
      size="large"
      dataSource={posts}
      pagination={pagination}
      loading={isFetching}
      renderItem={post => <PostComponent {...post}
        isAuthorized={isAuthorized}
        isOwn={currentUser.id === post.author.id}
        isSubmitting={likesInProgress.includes(post.id)}
        editMode={post.id === editingPostId}
        onEditClick={() => dispatch(actions.setEditingPostId(post.id))}
        onLikeClick={onLikeClick(post.id, post.isLiked)}
        onDeleteClick={onDeleteClick(post.id)}
        onCommentsClick={onCommentsClick(post.id)}
        onUnauthorizedClick={onUnauthorizedClick}
        onFinish={onFinishUpdatingPost(post.id)}
      />}
    />
  </div>
}

export default React.memo(Posts);