import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { List } from 'antd';
import { selectComments, selectCommentsWithOpenedReplies, selectEditingCommentId, selectEditingPostId, selectEditingReplyId, selectFilter, selectIsFetching, selectLikeCommentsInProgress, selectLikePostsInProgress, selectLikeRepliesInProgress, selectPosts, selectPostsWithOpenedComments, selectReplies, selectTotalPostsCount } from "../../redux/selectors/public";
import { createComment, createPost, createReply, deleteComment, deletePost, deleteReply, requestComments, requestPosts, requestReplies, requestShiftedPost, toggleIsLikedComment, toggleIsLikedPost, toggleIsLikedReply, updateComment, updatePost, updateReply } from "../../redux/thunks/public";
import actions from "../../redux/actions/public";
import PostComponent from "./Post";
import PostsSearchForm from "./PostsSearchForm";
import { selectCurrentUser, selectIsAuthorized } from "../../redux/selectors/users";
import PostForm, { PostFormValues } from "./PostForm";
import { CommentFormValues } from "./Comments/CommentForm";
import { ReplyFormValues } from "./Comments/Replies/ReplyForm";
import EmptyList from "../common/Empty";

type Props = {
  authorId?: number
}

const Posts: React.FC<Props> = ({ authorId }) => {

  const dispatch = useDispatch();
  const isAuthorized = useSelector(selectIsAuthorized);
  const currentUser = useSelector(selectCurrentUser);
  const isFetching = useSelector(selectIsFetching);
  const filter = useSelector(selectFilter);
  const posts = useSelector(selectPosts);
  const totalPostsCount = useSelector(selectTotalPostsCount) as number;
  const likePostsInProgress = useSelector(selectLikePostsInProgress);
  const editingPostId = useSelector(selectEditingPostId);
  const postsWithOpenedComments = useSelector(selectPostsWithOpenedComments);
  const comments = useSelector(selectComments);
  const likeCommentsInProgress = useSelector(selectLikeCommentsInProgress);
  const editingCommentId = useSelector(selectEditingCommentId);
  const commentsWithOpenedReplies = useSelector(selectCommentsWithOpenedReplies);
  const replies = useSelector(selectReplies);
  const likeRepliesInProgress = useSelector(selectLikeRepliesInProgress);
  const editingReplyId = useSelector(selectEditingReplyId);

  useEffect(() => {
    if (authorId) {
      dispatch(actions.setFilter({ ...filter, authorId }));
    }
    return () => {
      if (authorId) {
        dispatch(actions.setFilter({ ...filter, authorId: null as number | null }));
      }
    }
  }, [authorId])

  useEffect(() => {
    dispatch(requestPosts(filter));
  }, [filter])

  useEffect(() => {
    const pagesCount = Math.ceil(totalPostsCount / filter.pageSize);
    if (!isFetching &&
      posts.length > 0 &&
      posts.length < filter.pageSize &&
      filter.page < pagesCount) {
      dispatch(requestShiftedPost(filter));
    }
  }, [posts.length])

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

  const onViewRepliesClick = (commentId: number) => () => {
    if (!commentsWithOpenedReplies.includes(commentId)) {
      const comment = comments.find(comment => comment.id === commentId);
      if (comment?.repliesCount === 0) {
        dispatch(actions.addCommentWithOpenedReplies(commentId));
      } else {
        dispatch(requestReplies(commentId));
      }
    }
  }

  const onLikeReplyClick = (replyId: number, isLiked: boolean) => () => {
    dispatch(toggleIsLikedReply(replyId, isLiked));
  }

  const onDeleteReplyClick = (replyId: number) => () => {
    dispatch(deleteReply(replyId));
  }

  const onFinishCreatingReply = (commentId: number) => (values: ReplyFormValues) => {
    dispatch(createReply(commentId, values.content));
  }

  const onFinishUpdatingReply = (replyId: number) => (values: ReplyFormValues) => {
    dispatch(updateReply(replyId, values.content));
  }

  const onEditReplyClick = (replyId: number) => () => {
    dispatch(actions.setEditingReplyId(replyId));
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
      />
    ),
    total: totalPostsCount,
    current: filter.page,
    pageSize: filter.pageSize,
    disabled: isFetching,
    position: "both" as "both" | "top" | "bottom"
  }

  let canPost = false;
  if (isAuthorized) {
    if (authorId) {
      canPost = authorId === currentUser.id;
    } else {
      canPost = true;
    }
  }

  return <div>
    {canPost && <PostForm onFinish={onFinishCreatingPost} />}
    <PostsSearchForm isSubmitting={isFetching} />
    <List
      locale={{
        emptyText: <EmptyList />
      }}
      itemLayout="vertical"
      size="large"
      dataSource={posts}
      pagination={pagination}
      loading={isFetching}
      renderItem={post => {
        const postComments = comments.filter(comment => comment.postId === post.id);
        const postCommentsReplies = replies.filter(reply => postComments.find(comment => comment.id === reply.commentId));
        return <PostComponent post={post}
          isAuthorized={isAuthorized}
          currentUserId={currentUser.id as number}
          likeInProgress={likePostsInProgress.includes(post.id)}
          likeCommentsInProgress={likeCommentsInProgress}
          editMode={post.id === editingPostId}
          editingCommentId={editingCommentId as number}
          comments={postComments}
          openedComments={postsWithOpenedComments.includes(post.id)}
          replies={postCommentsReplies}
          editingReplyId={editingReplyId as number}
          likeRepliesInProgress={likeRepliesInProgress}
          commentsWithOpenedReplies={commentsWithOpenedReplies}
          handlers={{
            posts: {
              onLikeClick: onLikePostClick(post.id, post.isLiked),
              onEditClick: onEditPostClick(post.id),
              onDeleteClick: onDeletePostClick(post.id),
              onViewCommentsClick: onViewCommentsClick(post.id),
              onFinishUpdating: onFinishUpdatingPost(post.id)
            },
            comments: {
              onLikeClick: onLikeCommentClick,
              onEditClick: onEditCommentClick,
              onDeleteClick: onDeleteCommentClick,
              onFinishCreating: onFinishCreatingComment,
              onFinishUpdating: onFinishUpdatingComment,
              onViewRepliesClick
            },
            replies: {
              onLikeClick: onLikeReplyClick,
              onEditClick: onEditReplyClick,
              onDeleteClick: onDeleteReplyClick,
              onFinishCreating: onFinishCreatingReply,
              onFinishUpdating: onFinishUpdatingReply
            },
            common: {
              onUnauthorizedClick
            }
          }}
        />
      }}
    />
  </div>
}

export default React.memo(Posts);