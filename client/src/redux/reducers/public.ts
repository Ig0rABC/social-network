import { createReducer } from "@reduxjs/toolkit";
import { Post, Comment, Category, Reply } from "../../types/models";
import {
  addPendingComments,
  addPendingLikeComment,
  addPendingLikePost,
  addPendingLikeReply,
  addPendingReplies,
  openComments,
  openReplies,
  resetEditingCommentId, resetEditingPostId, resetEditingReplyId,
  setEditingCommentId, setEditingPostId, setEditingReplyId, setFilter
} from "../actions/public";
import {
  createComment, createPost, createReply, deleteComment, deletePost,
  deleteReply, fetchComments, fetchPosts, fetchReplies, fetchShiftedPost,
  setIsLikedComment, setIsLikedPost, setIsLikedReply, updateComment,
  updatePost, updateReply
} from "../thunks/public";

const initialState = {
  pendingPosts: false,
  posts: [] as Post[],
  totalPostsCount: 0,
  pendingLikePosts: [] as number[],
  editingPostId: null as number | null,
  pendingComments: [] as number[],
  openedComments: [] as number[],
  filter: {
    authorId: null as number | null,
    category: null as Category | null,
    search: null as string | null,
    page: 1,
    pageSize: 4
  },
  comments: [] as Comment[],
  pendingLikeComments: [] as number[],
  editingCommentId: null as number | null,
  pendingReplies: [] as number[],
  openedReplies: [] as number[],
  replies: [] as Reply[],
  pendingLikeReplies: [] as number[],
  editingReplyId: null as number | null
}

export type Filter = typeof initialState.filter;

const publicReducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchPosts.pending, (state) => ({
      ...state,
      pendingPosts: true
    }))
    .addCase(fetchPosts.fulfilled, (state, { payload }) => ({
      ...state,
      pendingPosts: false,
      posts: payload.posts,
      totalPostsCount: payload.totalCount
    }))
    .addCase(createPost.fulfilled, (state, { payload }) => ({
      ...state,
      posts: state.posts.concat(payload)
    }))
    .addCase(deletePost.fulfilled, (state, { payload }) => ({
      ...state,
      posts: state.posts.filter(post => post.id !== payload),
      totalPostsCount: state.totalPostsCount - 1
    }))
    .addCase(fetchShiftedPost.fulfilled, (state, { payload }) => ({
      ...state,
      posts: state.posts.concat(payload)
    }))
    .addCase(updatePost.fulfilled, (state, { payload }) => ({
      ...state,
      editingPostId: null,
      posts: state.posts
        .map(post => post.id === payload.postId
          ? {
            ...post,
            category: payload.category,
            content: payload.content
          } : post
        )
    }))
    .addCase(setEditingPostId, (state, { payload }) => ({
      ...state,
      editingPostId: payload
    }))
    .addCase(resetEditingPostId, (state) => ({
      ...state,
      editingPostId: null
    }))
    .addCase(addPendingLikePost, (state, { payload }) => ({
      ...state,
      pendingLikePosts: state.pendingLikePosts.concat(payload)
    }))
    .addCase(setIsLikedPost.fulfilled, (state, { payload }) => ({
      ...state,
      posts: state.posts
        .map(post => post.id === payload.postId
          ? {
            ...post,
            likesCount: payload.isLiked
              ? post.likesCount + 1
              : post.likesCount - 1,
            isLiked: payload.isLiked,
          } : post
        ),
      pendingLikePosts: state.pendingLikePosts
        .filter(id => id !== payload.postId)
    }))
    .addCase(setFilter, (state, { payload }) => ({
      ...state,
      filter: payload
    }))
    .addCase(addPendingComments, (state, { payload }) => ({
      ...state,
      pendingComments: state.pendingComments.concat(payload)
    }))
    .addCase(openComments, (state, { payload }) => ({
      ...state,
      openedComments: state.openedComments.concat(payload)
    }))
    .addCase(fetchComments.fulfilled, (state, { payload }) => {
      const postId = payload[0].postId;
      return {
        ...state,
        pendingComments: state.pendingComments.filter(id => id !== postId),
        comments: state.comments.concat(payload),
        openedComments: state.openedComments.concat(postId)
      }
    })
    .addCase(createComment.fulfilled, (state, { payload }) => ({
      ...state,
      comments: state.comments.concat(payload),
      posts: state.posts
        .map(post => post.id === payload.postId
          ? {
            ...post,
            commentsCount: post.commentsCount + 1
          } : post
        )
    }))
    .addCase(deleteComment.fulfilled, (state, { payload }) => {
      const postId = state.comments
        .find(comment => comment.id === payload)
        ?.postId;
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== payload),
        posts: state.posts
          .map(post => post.id === postId
            ? {
              ...post,
              commentsCount: post.commentsCount - 1
            } : post
          )
      }
    })
    .addCase(updateComment.fulfilled, (state, { payload }) => ({
      ...state,
      comments: state.comments
        .map(comment => comment.id === payload.commentId
          ? {
            ...comment,
            content: payload.content
          } : comment
        )
    }))
    .addCase(setEditingCommentId, (state, { payload }) => ({
      ...state,
      editingCommentId: payload
    }))
    .addCase(resetEditingCommentId, (state) => ({
      ...state,
      editingCommentId: null
    }))
    .addCase(addPendingLikeComment, (state, { payload }) => ({
      ...state,
      pendingLikeComments: state.pendingLikeComments.concat(payload)
    }))
    .addCase(setIsLikedComment.fulfilled, (state, { payload }) => ({
      ...state,
      comments: state.comments
        .map(comment => comment.id === payload.commentId
          ? {
            ...comment,
            likesCount: payload.isLiked
              ? comment.likesCount + 1
              : comment.likesCount - 1,
            isLiked: payload.isLiked,
          } : comment
        ),
      pendingLikeComments: state.pendingLikeComments
        .filter(id => id !== payload.commentId)
    }))
    .addCase(addPendingReplies, (state, { payload }) => ({
      ...state,
      pendingReplies: state.pendingReplies.concat(payload)
    }))
    .addCase(openReplies, (state, { payload }) => ({
      ...state,
      openedReplies: state.openedReplies.concat(payload)
    }))
    .addCase(fetchReplies.fulfilled, (state, { payload }) => {
      const commentId = payload[0].commentId;
      return {
        ...state,
        pendingReplies: state.pendingReplies.filter(id => id !== commentId),
        replies: state.replies.concat(payload),
        openedReplies: state.openedReplies.concat(commentId)
      }
    })
    .addCase(createReply.fulfilled, (state, { payload }) => ({
      ...state,
      replies: state.replies.concat(payload),
      comments: state.comments
        .map(comment => comment.id === payload.commentId
          ? {
            ...comment,
            repliesCount: comment.repliesCount + 1
          } : comment
        )
    }))
    .addCase(deleteReply.fulfilled, (state, { payload }) => {
      const commentId = state.replies
        .find(reply => reply.id === payload)
        ?.commentId;
      return {
        ...state,
        replies: state.replies.filter(reply => reply.id !== payload),
        comments: state.comments
          .map(comment => comment.id === commentId
            ? {
              ...comment,
              repliesCount: comment.repliesCount - 1
            } : comment
          )
      }
    })
    .addCase(updateReply.fulfilled, (state, { payload }) => ({
      ...state,
      replies: state.replies
        .map(reply => reply.id === payload.replyId
          ? {
            ...reply,
            content: payload.content
          } : reply
        )
    }))
    .addCase(setEditingReplyId, (state, { payload }) => ({
      ...state,
      editingReplyId: payload
    }))
    .addCase(resetEditingReplyId, (state) => ({
      ...state,
      editingReplyId: null
    }))
    .addCase(addPendingLikeReply, (state, { payload }) => ({
      ...state,
      pendingLikeReplies: state.pendingLikeReplies.concat(payload)
    }))
    .addCase(setIsLikedReply.fulfilled, (state, { payload }) => ({
      ...state,
      replies: state.replies
        .map(reply => reply.id === payload.replyId
          ? {
            ...reply,
            likesCount: payload.isLiked
              ? reply.likesCount + 1
              : reply.likesCount - 1,
            isLiked: payload.isLiked,
          } : reply
        ),
      pendingLikeReplies: state.pendingLikeReplies
        .filter(id => id !== payload.replyId)
    }))
)

export default publicReducer;