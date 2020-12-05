import { InferActions } from "../../types/flux";
import { Category, Post, Comment, Reply } from "../../types/models";
import { Filter } from "../reducers/public";

export const actions = {
  setIsFetching: (isFetching: boolean) => ({
    type: "public/SET-IS-FETCHING",
    payload: isFetching
  } as const),
  setPosts: (posts: Post[]) => ({
    type: "public/SET-POSTS",
    payload: posts
  } as const),
  setTotalPostsCount: (totalPostsCount: number) => ({
    type: "public/SET-TOTAL-POSTS-COUNT",
    payload: totalPostsCount
  } as const),
  addNewPost: (post: Post) => ({
    type: "public/ADD-NEW-POST",
    payload: post
  } as const),
  deletePost: (postId: number) => ({
    type: "public/DELETE-POST",
    payload: postId
  } as const),
  addShiftedPost: (post: Post) => ({
    type: "public/ADD-SHIFTED-POST",
    payload: post
  } as const),
  updatePost: (postId: number, category: Category, content: string) => ({
    type: "public/UPDATE-POST",
    payload: {
      postId,
      category,
      content
    }
  } as const),
  setEditingPostId: (postId: number) => ({
    type: "public/SET-EDITING-POST-ID",
    payload: postId
  } as const),
  resetEditingPostId: () => ({
    type: "public/RESET-EDITING-POST-ID"
  } as const),
  toggleIsLikedPost: (postId: number) => ({
    type: "public/TOGGLE-IS-LIKED-POST",
    payload: postId
  } as const),
  setLikePostInProgress: (postId: number, isFetching: boolean) => ({
    type: "public/SET-LIKE-POST-IN-PROGRESS",
    payload: {
      postId,
      isFetching
    }
  } as const),
  setFilter: (filter: Filter) => ({
    type: "public/SET-FILTER",
    payload: filter
  } as const),
  setOpenPostCommentsInProgress: (postId: number, isFetching: boolean) => ({
    type: "public/SET-OPEN-POST-COMMENTS-IN-PROGRESS",
    payload: {
      postId,
      isFetching
    }
  } as const),
  addPostWithOpenedComments: (postId: number) => ({
    type: "public/ADD-POST-WITH-OPENED-COMMENTS",
    payload: postId
  } as const),
  addComments: (comments: Comment[]) => ({
    type: "public/ADD-COMMENTS",
    payload: comments
  } as const),
  addNewComment: (comment: Comment) => ({
    type: "public/ADD-NEW-COMMENT",
    payload: comment
  } as const),
  updateComment: (commentId: number, content: string) => ({
    type: "public/UPDATE-COMMENT",
    payload: {
      commentId,
      content
    }
  } as const),
  deleteComment: (commentId: number) => ({
    type: "public/DELETE-COMMENT",
    payload: commentId
  } as const),
  setEditingCommentId: (commentId: number) => ({
    type: "public/SET-EDITING-COMMENT-ID",
    payload: commentId
  } as const),
  resetEditingCommentId: () => ({
    type: "public/RESET-EDITING-COMMENT-ID"
  } as const),
  toggleIsLikedComment: (commentId: number) => ({
    type: "public/TOGGLE-IS-LIKED-COMMENT",
    payload: commentId
  } as const),
  setLikeCommentInProgress: (commentId: number, isFetching: boolean) => ({
    type: "public/SET-LIKE-COMMENT-IN-PROGRESS",
    payload: {
      commentId,
      isFetching
    }
  } as const),
  setOpenCommentRepliesInProgress: (commentId: number, isFetching: boolean) => ({
    type: "public/SET-OPEN-COMMENT-REPLIES-IN-PROGRESS",
    payload: {
      commentId,
      isFetching
    }
  } as const),
  addCommentWithOpenedReplies: (commentId: number) => ({
    type: "public/ADD-COMMENT-WITH-OPENED-REPLIES",
    payload: commentId
  } as const),
  addReplies: (replies: Reply[]) => ({
    type: "public/ADD-REPLIES",
    payload: replies
  } as const),
  addNewReply: (reply: Reply) => ({
    type: "public/ADD-NEW-REPLY",
    payload: reply
  } as const),
  updateReply: (replyId: number, content: string) => ({
    type: "public/UPDATE-REPLY",
    payload: {
      replyId,
      content
    }
  } as const),
  deleteReply: (replyId: number) => ({
    type: "public/DELETE-REPLY",
    payload: replyId
  } as const),
  setEditingReplyId: (replyId: number) => ({
    type: "public/SET-EDITING-REPLY-ID",
    payload: replyId
  } as const),
  resetEitingReplyId: () => ({
    type: "public/RESET-EDITING-REPLY-ID"
  } as const),
  toggleIsLikedReply: (replyId: number) => ({
    type: "public/TOGGLE-IS-LIKED-REPLY",
    payload: replyId
  } as const),
  setLikeReplyInProgress: (replyId: number, isFetching: boolean) => ({
    type: "public/SET-LIKE-REPLY-IN-PROGRESS",
    payload: {
      replyId,
      isFetching
    }
  } as const)
}

export default actions;

export type Action = InferActions<typeof actions>;