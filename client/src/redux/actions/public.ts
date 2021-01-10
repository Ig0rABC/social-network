import { createAction, PrepareAction } from "@reduxjs/toolkit";
import { Filter } from "../reducers/public";

export const setFilter = createAction<PrepareAction<Filter>, "public/SET-FILTER">("public/SET-FILTER", filter => ({
  payload: filter
}));

export const setEditingPostId = createAction<PrepareAction<number>, "public/SET-EDITING-POST-ID">("public/SET-EDITING-POST-ID", postId => ({
  payload: postId
}));

export const setEditingCommentId = createAction<PrepareAction<number>, "public/SET-EDITING-COMMENT-ID">("public/SET-EDITING-COMMENT-ID", commentId => ({
  payload: commentId
}));

export const setEditingReplyId = createAction<PrepareAction<number>, "public/SET-EDITING-REPLY-ID">("public/SET-EDITING-REPLY-ID", replyId => ({
  payload: replyId
}));

export const resetEditingCommentId = createAction("public/RESET-EDITING-COMMENT-ID");
export const resetEditingPostId = createAction("public/RESET-EDITING-POST-ID");
export const resetEditingReplyId = createAction("public/RESET-EDITING-REPLY-ID");

export const openComments = createAction<PrepareAction<number>, "public/OPEN-COMMENTS">("public/OPEN-COMMENTS", postId => ({
  payload: postId
}));

export const openReplies = createAction<PrepareAction<number>, "public/OPEN-REPLIES">("public/OPEN-REPLIES", commentId => ({
  payload: commentId
}));

export const addPendingLikePost = createAction<PrepareAction<number>, "public/ADD-PENDING-LIKE-POST">("public/ADD-PENDING-LIKE-POST", postId => ({
  payload: postId
}));

export const addPendingLikeComment = createAction<PrepareAction<number>, "public/ADD-PENDING-LIKE-COMMENT">("public/ADD-PENDING-LIKE-COMMENT", commentId => ({
  payload: commentId
}));

export const addPendingLikeReply = createAction<PrepareAction<number>, "public/ADD-PENDING-LIKE-REPLY">("public/ADD-PENDING-LIKE-REPLY", replyId => ({
  payload: replyId
}));

export const addPendingComments = createAction<PrepareAction<number>, "public/ADD-PENDING-COMMENTS">("public/ADD-PENDING-COMMENTS", postId => ({
  payload: postId
}));

export const addPendingReplies = createAction<PrepareAction<number>, "public/ADD-PENDING-REPLIES">("public/ADD-PENDING-REPLIES", commentId => ({
  payload: commentId
}));