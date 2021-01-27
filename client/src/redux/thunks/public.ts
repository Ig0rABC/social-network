import { createAsyncThunk } from "@reduxjs/toolkit";
import { Category } from "../../types/models";
import { Filter } from "../reducers/public";
import postsAPI from "../../api/posts";
import commentsAPI from "../../api/comments";
import repliesAPI from "../../api/replies";
import { addPendingComments, addPendingLikeComment, addPendingLikePost, addPendingLikeReply, addPendingReplies } from "../actions/public";
import followAPI from "../../api/follow";

export const fetchPosts = createAsyncThunk(
  "public/FETCH-POSTS",
  async (filter: Filter) => {
    return await postsAPI.getPosts(filter);
  }
)

export const fetchFeed = createAsyncThunk(
  "public/FETCH-FEED",
  async () => {
    return await followAPI.getFeed();
  }
)

export const setIsLikedPost = createAsyncThunk(
  "public/SET-IS-LIKED-POST",
  async ({ postId, isLiked }: { postId: number, isLiked: boolean }, { dispatch }) => {
    dispatch(addPendingLikePost(postId));
    if (isLiked) {
      await postsAPI.unlikePost(postId);
    } else {
      await postsAPI.likePost(postId);
    }
    return { postId, isLiked };
  }
)

export const createPost = createAsyncThunk(
  "public/CREATE-POST",
  async ({ category, content }: { category: Category, content: string }) => {
    return await postsAPI.createPost(category, content);
  }
)

export const deletePost = createAsyncThunk(
  "public/DELETE-POST",
  async (postId: number) => {
    await postsAPI.deletePost(postId);
    return postId;
  }
)

export const fetchShiftedPost = createAsyncThunk(
  "public/FETCH-SHIFTED-POST",
  async (filter: Filter) => {
    const newFilter = {
      ...filter,
      page: (filter.page * filter.pageSize),
      pageSize: 1
    };
    return await postsAPI.getPosts(newFilter);
  }
)

export const updatePost = createAsyncThunk(
  "public/UPDATE-POST",
  async ({ postId, category, content }: { postId: number, category: Category, content: string }) => {
    await postsAPI.updatePost(postId, category, content);
    return { postId, category, content };
  }
)

export const fetchComments = createAsyncThunk(
  "public/FETCH-COMMENTS",
  async ({ postId, authorId }: { postId: number, authorId: number | null }, { dispatch }) => {
    dispatch(addPendingComments(postId));
    return await commentsAPI.getComments(postId, authorId);
  }
)

export const createComment = createAsyncThunk(
  "public/CREATE-COMMENT",
  async ({ postId, content }: { postId: number, content: string }) => {
    return await commentsAPI.createComment(postId, content);
  }
)

export const deleteComment = createAsyncThunk(
  "public/DELETE-COMMENT",
  async (commentId: number): Promise<number> => {
    await commentsAPI.deleteComment(commentId);
    return commentId;
  }
)

export const updateComment = createAsyncThunk(
  "public/UPDATE-COMMENT",
  async ({ commentId, content }: { commentId: number, content: string }) => {
    await commentsAPI.updateComment(commentId, content);
    return { commentId, content };
  }
)

export const setIsLikedComment = createAsyncThunk(
  "public/SET-IS-LIKED-COMMENT",
  async ({ commentId, isLiked }: { commentId: number, isLiked: boolean }, { dispatch }) => {
    dispatch(addPendingLikeComment(commentId));
    if (isLiked) {
      await commentsAPI.unlikeComment(commentId);
    } else {
      await commentsAPI.likeComment(commentId);
    }
    return { commentId, isLiked };
  }
)

export const fetchReplies = createAsyncThunk(
  "public/FETCH-REPLIES",
  async (commentId: number, { dispatch }) => {
    dispatch(addPendingReplies(commentId));
    return await repliesAPI.getReplies(commentId);
  }
)

export const createReply = createAsyncThunk(
  "public/CREATE-REPLY",
  async ({ commentId, content }: { commentId: number, content: string }) => {
    return await repliesAPI.createReply(commentId, content);
  }
)

export const updateReply = createAsyncThunk(
  "public/UPDATE-REPLY",
  async ({ replyId, content }: { replyId: number, content: string }) => {
    await repliesAPI.updateReply(replyId, content);
    return { replyId, content };
  }
)

export const deleteReply = createAsyncThunk(
  "public/DELETE-REPLY",
  async (replyId: number) => {
    await repliesAPI.deleteReply(replyId);
    return replyId;
  }
)

export const setIsLikedReply = createAsyncThunk(
  "public/SET-IS-LIKED-REPLY",
  async ({ replyId, isLiked }: { replyId: number, isLiked: boolean }, { dispatch }) => {
    dispatch(addPendingLikeReply(replyId));
    if (isLiked) {
      await repliesAPI.unlikeReply(replyId);
    } else {
      await repliesAPI.likeReply(replyId);
    }
    return { replyId, isLiked };
  }
)