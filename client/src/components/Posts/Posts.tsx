import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { List } from 'antd';
import { selectComments, selectEditingCommentId, selectEditingPostId, selectFilter, selectIsFetching, selectLikeCommentsInProgress, selectLikePostsInProgress, selectPosts, selectPostsWithOpenedComments, selectTotalPostsCount } from "../../redux/selectors/public";
import { createComment, createPost, deleteComment, deletePost, requestComments, requestPosts, requestShiftedPost, setFilter, toggleIsLikedComment, toggleIsLikedPost, updateComment, updatePost } from "../../redux/thunks/public";
import actions from "../../redux/actions/public";
import PostComponent from "./Post";
import PostsSearchForm from "./PostsSearchForm";
import { selectCurrentUser, selectIsAuthorized } from "../../redux/selectors/users";
import PostForm, { PostFormValues } from "./PostForm";
import { CommentFormValues } from "./Comments/CommentForm";

type Props = {
  isOwnPosts: boolean
}

const Posts: React.FC<Props> = ({ isOwnPosts }) => {

  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const posts = useSelector(selectPosts);
  const totalPostsCount = useSelector(selectTotalPostsCount) as number;
  const isFetching = useSelector(selectIsFetching);
  const likePostsInProgress = useSelector(selectLikePostsInProgress);
  const likeCommentsInProgress = useSelector(selectLikeCommentsInProgress);
  const isAuthorized = useSelector(selectIsAuthorized);
  const currentUser = useSelector(selectCurrentUser);
  const editingPostId = useSelector(selectEditingPostId);
  const editingCommentId = useSelector(selectEditingCommentId);
  const comments = useSelector(selectComments);
  const postsWithOpenedComments = useSelector(selectPostsWithOpenedComments);
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

  const onLikePostClick = (postId: number, isLiked: boolean) => () => {
    dispatch(toggleIsLikedPost(postId, isLiked));
  }

  const onLikeCommentClick = (commentId: number, isLiked: boolean) => () => {
    dispatch(toggleIsLikedComment(commentId, isLiked));
  }

  const onViewCommentsClick = (postId: number) => () => {
    if (!postsWithOpenedComments.includes(postId)) {
      const post = posts.find(post => post.id === postId);
      if (post?.commentsCount === 0) {
        dispatch(actions.addPostWithOpenedComments(postId));
      } else {
        dispatch(requestComments(postId));
      }
    }
  }

  const onDeletePostClick = (postId: number) => () => {
    dispatch(deletePost(postId));
  }

  const onDeleteCommentClick = (commentId: number) => () => {
    dispatch(deleteComment(commentId));
  }

  const onEditPostClick = (postId: number) => () => {
    dispatch(actions.setEditingPostId(postId))
  }

  const onEditCommentClick = (commentId: number) => () => {
    dispatch(actions.setEditingCommentId(commentId));
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

  const onFinishCreatingComment = (postId: number) => (values: CommentFormValues) => {
    dispatch(createComment(postId, values.content))
  }

  const onFinishUpdatingComment = (commentId: number) => (values: CommentFormValues) => {
    dispatch(updateComment(commentId, values.content))
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
    position: "both" as "both" | "top" | "bottom"
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
      renderItem={post => (
        <PostComponent post={post}
          isAuthorized={isAuthorized}
          currentUserId={currentUser.id as number}
          likeInProgress={likePostsInProgress.includes(post.id)}
          likeCommentsInProgress={likeCommentsInProgress}
          editMode={post.id === editingPostId}
          editingCommentId={editingCommentId as number}
          comments={comments.filter(comment => comment.postId === post.id)}
          openedComments={postsWithOpenedComments.includes(post.id)}
          handlers={{
            posts: {
              onLikePostClick: onLikePostClick(post.id, post.isLiked),
              onEditPostClick: onEditPostClick(post.id),
              onDeletePostClick: onDeletePostClick(post.id),
              onViewCommentsClick: onViewCommentsClick(post.id),
              onFinishUpdatingPost: onFinishUpdatingPost(post.id)
            },
            comments: {
              onLikeCommentClick,
              onEditCommentClick,
              onDeleteCommentClick,
              onFinishCreatingComment: onFinishCreatingComment(post.id),
              onFinishUpdatingComment
            },
            common: {
              onUnauthorizedClick
            }
          }}
        />)}
    />
  </div>
}

export default React.memo(Posts);