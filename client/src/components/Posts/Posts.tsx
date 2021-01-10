import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { List } from 'antd';
import {
  selectComments, selectOpenedComments,
  selectEditingCommentId, selectEditingPostId,
  selectEditingReplyId, selectFilter,
  selectPendingPosts, selectPendingLikePosts,
  selectPendingLikeComments, selectPendingLikeReplies,
  selectPosts, selectOpenedReplies, selectReplies,
  selectTotalPostsCount
} from "../../redux/selectors/public";
import {
  createComment, createPost, createReply,
  deleteComment, deletePost, deleteReply,
  fetchComments, fetchPosts, fetchReplies,
  fetchShiftedPost, setIsLikedComment,
  setIsLikedPost, setIsLikedReply,
  updateComment, updatePost, updateReply
} from "../../redux/thunks/public";
import {
  openComments,
  openReplies,
  resetEditingCommentId, resetEditingPostId, resetEditingReplyId,
  setEditingCommentId, setEditingPostId, setEditingReplyId, setFilter
} from "../../redux/actions/public";
import { selectCurrentUser, selectIsAuthorized } from "../../redux/selectors/users";
import Post from "./Post";
import PostsSearchForm from "./PostsSearchForm";
import PostForm, { PostFormValues } from "./PostForm";
import { CommentFormValues } from "../Comments/CommentForm";
import { ReplyFormValues } from "../Replies/ReplyForm";
import EmptyList from "../common/Empty";

type Props = {
  authorId?: number
}

const Posts: React.FC<Props> = ({ authorId }) => {

  const dispatch = useDispatch();
  const isAuthorized = useSelector(selectIsAuthorized);
  const currentUser = useSelector(selectCurrentUser);
  const pendingPosts = useSelector(selectPendingPosts);
  const filter = useSelector(selectFilter);
  const posts = useSelector(selectPosts);
  const totalPostsCount = useSelector(selectTotalPostsCount) as number;
  const pendingLikePosts = useSelector(selectPendingLikePosts);
  const editingPostId = useSelector(selectEditingPostId);
  const openedComments = useSelector(selectOpenedComments);
  const comments = useSelector(selectComments);
  const pendingLikeComments = useSelector(selectPendingLikeComments);
  const editingCommentId = useSelector(selectEditingCommentId);
  const openedReplies = useSelector(selectOpenedReplies);
  const replies = useSelector(selectReplies);
  const pendingLikeReplies = useSelector(selectPendingLikeReplies);
  const editingReplyId = useSelector(selectEditingReplyId);

  useEffect(() => {
    if (authorId) {
      dispatch(setFilter({ ...filter, authorId }));
    }
    return () => {
      if (authorId) {
        dispatch(setFilter({ ...filter, authorId: null as number | null }));
      }
    }
  }, [authorId])

  useEffect(() => {
    dispatch(fetchPosts(filter));
  }, [filter])

  useEffect(() => {
    const pagesCount = Math.ceil(totalPostsCount / filter.pageSize);
    if (!pendingPosts &&
      posts.length > 0 &&
      posts.length < filter.pageSize &&
      filter.page < pagesCount) {
      dispatch(fetchShiftedPost(filter));
    }
  }, [posts.length])

  const onLikePostClick = (postId: number, isLiked: boolean) => () => {
    dispatch(setIsLikedPost({ postId, isLiked: !isLiked }));
  }

  const onLikeCommentClick = (commentId: number, isLiked: boolean) => () => {
    dispatch(setIsLikedComment({ commentId, isLiked: !isLiked }));
  }

  const onViewCommentsClick = (postId: number) => () => {
    if (!openedComments.includes(postId)) {
      const commentsCount = posts
        .find(post => post.id === postId)
        ?.commentsCount;
      if (commentsCount === 0) {
        dispatch(openComments(postId));
      } else {
        dispatch(fetchComments({ postId, authorId: null }));
      }
    }
  }

  const onDeletePostClick = (postId: number) => () => {
    dispatch(deletePost(postId));
  }

  const onCancelEditingPostClick = () => {
    dispatch(resetEditingPostId());
  }

  const onDeleteCommentClick = (commentId: number) => () => {
    dispatch(deleteComment(commentId));
  }

  const onEditPostClick = (postId: number) => () => {
    dispatch(setEditingPostId(postId))
  }

  const onEditCommentClick = (commentId: number) => () => {
    dispatch(setEditingCommentId(commentId));
  }

  const onCancelEditingCommentClick = () => {
    dispatch(resetEditingCommentId());
  }

  const onUnauthorizedClick = () => {
    console.log("ANUTHORIZED");
  }

  const onFinishCreatingPost = (values: PostFormValues) => {
    dispatch(createPost(values));
  }

  const onFinishUpdatingPost = (postId: number) => (values: PostFormValues) => {
    dispatch(updatePost({ postId, ...values }));
  }

  const onFinishCreatingComment = (postId: number) => (values: CommentFormValues) => {
    dispatch(createComment({ postId, ...values }))
  }

  const onFinishUpdatingComment = (commentId: number) => (values: CommentFormValues) => {
    dispatch(updateComment({ commentId, ...values }))
  }

  const onViewRepliesClick = (commentId: number) => () => {
    if (!openedReplies.includes(commentId)) {
      const comment = comments.find(comment => comment.id === commentId);
      if (comment?.repliesCount === 0) {
        dispatch(openReplies(commentId));
      } else {
        dispatch(fetchReplies(commentId));
      }
    }
  }

  const onLikeReplyClick = (replyId: number, isLiked: boolean) => () => {
    dispatch(setIsLikedReply({ replyId, isLiked: !isLiked }));
  }

  const onDeleteReplyClick = (replyId: number) => () => {
    dispatch(deleteReply(replyId));
  }

  const onFinishCreatingReply = (commentId: number) => (values: ReplyFormValues) => {
    dispatch(createReply({ commentId, ...values }));
  }

  const onFinishUpdatingReply = (replyId: number) => (values: ReplyFormValues) => {
    dispatch(updateReply({ replyId, ...values }));
  }

  const onEditReplyClick = (replyId: number) => () => {
    dispatch(setEditingReplyId(replyId))
  }

  const onCancelEditingReplyClick = () => {
    dispatch(resetEditingReplyId());
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
    disabled: pendingPosts,
    position: "both" as "both" | "top" | "bottom"
  }

  let canPost = false;
  if (isAuthorized) {
    if (authorId) {
      canPost = authorId === currentUser?.id;
    } else {
      canPost = true;
    }
  }

  return <div>
    {canPost && <PostForm onFinish={onFinishCreatingPost} />}
    <PostsSearchForm isSubmitting={pendingPosts} />
    <List
      locale={{
        emptyText: <EmptyList />
      }}
      itemLayout="vertical"
      size="large"
      dataSource={posts}
      pagination={pagination}
      loading={pendingPosts}
      renderItem={post => {
        const postComments = comments
          .filter(comment => comment.postId === post.id);
        const postCommentsReplies = replies
          .filter(reply => postComments
            .find(comment => comment.id === reply.commentId));
        return <Post post={post}
          isAuthorized={isAuthorized}
          currentUserId={currentUser?.id as number}
          pendingLike={pendingLikePosts.includes(post.id)}
          pendingLikeComments={pendingLikeComments}
          editMode={post.id === editingPostId}
          editingCommentId={editingCommentId as number}
          comments={postComments}
          openedComments={openedComments.includes(post.id)}
          replies={postCommentsReplies}
          editingReplyId={editingReplyId as number}
          pendingLikeReplies={pendingLikeReplies}
          openedReplies={openedReplies}
          handlers={{
            posts: {
              onLikeClick: onLikePostClick(post.id, post.isLiked),
              onEditClick: onEditPostClick(post.id),
              onCancelEditingClick: onCancelEditingPostClick,
              onDeleteClick: onDeletePostClick(post.id),
              onViewCommentsClick: onViewCommentsClick(post.id),
              onFinishUpdating: onFinishUpdatingPost(post.id)
            },
            comments: {
              onLikeClick: onLikeCommentClick,
              onDeleteClick: onDeleteCommentClick,
              onEditClick: onEditCommentClick,
              onCancelEditingClick: onCancelEditingCommentClick,
              onFinishCreating: onFinishCreatingComment,
              onFinishUpdating: onFinishUpdatingComment,
              onViewRepliesClick
            },
            replies: {
              onLikeClick: onLikeReplyClick,
              onDeleteClick: onDeleteReplyClick,
              onEditClick: onEditReplyClick,
              onCancelEditingClick: onCancelEditingReplyClick,
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