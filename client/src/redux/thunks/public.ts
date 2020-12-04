import postsAPI from "../../api/posts";
import commentsAPI from "../../api/comments";
import { Thunk } from "../../types/flux";
import { Category } from "../../types/models";
import actions, { Action } from "../actions/public";
import { Filter } from "../reducers/public";

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

export const setFilter = (filter: Filter): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setFilter(filter));
  await dispatch(requestPosts(filter));
}

export const requestComments = (postId: number, authorId = null as number | null): Thunk<Action> => async (dispatch) => {
  const data = await commentsAPI.getComments(postId, authorId);
  dispatch(actions.addComments(data.comments));
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