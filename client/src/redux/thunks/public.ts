import { Thunk } from "../../types/flux";
import actions, { Action } from "../actions/public";
import { Category } from "../../types/models";
import { Filter } from "../reducers/public";
import commentsAPI from "../../api/comments";
import postsAPI from "../../api/posts";
import repliesAPI from "../../api/replies";

export const requestPosts = (filter: Filter): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setIsFetching(true));
  const data = await postsAPI.getPosts(filter);
  dispatch(actions.setPosts(data.posts));
  dispatch(actions.setTotalPostsCount(data.totalCount));
  dispatch(actions.setIsFetching(false));
}

export const toggleIsLikedPost = (postId: number, isLiked: boolean): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setLikePostInProgress(postId, true));
  if (isLiked) {
    await postsAPI.unlikePost(postId);
  } else {
    await postsAPI.likePost(postId);
  }
  dispatch(actions.toggleIsLikedPost(postId));
  dispatch(actions.setLikePostInProgress(postId, false));
}

export const createPost = (category: Category, content: string): Thunk<Action> => async (dispatch) => {
  const data = await postsAPI.createPost(category, content);
  dispatch(actions.addNewPost(data));
}

export const deletePost = (postId: number): Thunk<Action> => async (dispatch) => {
  await postsAPI.deletePost(postId);
  dispatch(actions.deletePost(postId));
}

export const requestShiftedPost = (filter: Filter): Thunk<Action> => async (dispatch) => {
  const newFilter = {
    ...filter,
    page: (filter.page * filter.pageSize),
    pageSize: 1
  };
  const data = await postsAPI.getPosts(newFilter);
  dispatch(actions.addShiftedPost(data.posts[0]));
}

export const updatePost = (postId: number, category: Category, content: string): Thunk<Action> => async (dispatch) => {
  await postsAPI.updatePost(postId, category, content);
  dispatch(actions.updatePost(postId, category, content));
  dispatch(actions.resetEditingPostId());
}

export const requestComments = (postId: number, authorId = null as number | null): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setOpenPostCommentsInProgress(postId, true));
  const data = await commentsAPI.getComments(postId, authorId);
  dispatch(actions.addComments(data.comments));
  dispatch(actions.setOpenPostCommentsInProgress(postId, false));
  dispatch(actions.addPostWithOpenedComments(postId));
}

export const createComment = (postId: number, content: string): Thunk<Action> => async (dispatch) => {
  const data = await commentsAPI.createComment(postId, content);
  dispatch(actions.addNewComment(data));
}

export const deleteComment = (commentId: number): Thunk<Action> => async (dispatch) => {
  await commentsAPI.deleteComment(commentId);
  dispatch(actions.deleteComment(commentId));
}

export const updateComment = (commentId: number, content: string): Thunk<Action> => async (dispatch) => {
  await commentsAPI.updateComment(commentId, content);
  dispatch(actions.updateComment(commentId, content));
  dispatch(actions.resetEditingCommentId());
}

export const toggleIsLikedComment = (commentId: number, isLiked: boolean): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setLikeCommentInProgress(commentId, true));
  if (isLiked) {
    await commentsAPI.unlikeComment(commentId);
  } else {
    await commentsAPI.likeComment(commentId);
  }
  dispatch(actions.toggleIsLikedComment(commentId));
  dispatch(actions.setLikeCommentInProgress(commentId, false));
}

export const requestReplies = (commentId: number): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setOpenCommentRepliesInProgress(commentId, true));
  const data = await repliesAPI.getReplies(commentId);
  dispatch(actions.addReplies(data.replies));
  dispatch(actions.setOpenCommentRepliesInProgress(commentId, false));
  dispatch(actions.addCommentWithOpenedReplies(commentId));
}

export const createReply = (commentId: number, content: string): Thunk<Action> => async (dispatch) => {
  const data = await repliesAPI.createReply(commentId, content);
  dispatch(actions.addNewReply(data));
}

export const updateReply = (replyId: number, content: string): Thunk<Action> => async (dispatch) => {
  await repliesAPI.updateReply(replyId, content);
  dispatch(actions.updateReply(replyId, content));
  dispatch(actions.resetEitingReplyId());
}

export const deleteReply = (replyId: number): Thunk<Action> => async (dispatch) => {
  await repliesAPI.deleteReply(replyId);
  dispatch(actions.deleteReply(replyId));
}

export const toggleIsLikedReply = (replyId: number, isLiked: boolean): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setLikeReplyInProgress(replyId, true));
  if (isLiked) {
    await repliesAPI.unlikeReply(replyId);
  } else {
    await repliesAPI.likeReply(replyId);
  }
  dispatch(actions.toggleIsLikedReply(replyId));
  dispatch(actions.setLikeReplyInProgress(replyId, false));
}