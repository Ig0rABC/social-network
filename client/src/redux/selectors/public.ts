import { RootState } from "../store";

export const selectIsFetching = (state: RootState) => {
  return state.public.isFetching;
}

export const selectFilter = (state: RootState) => {
  return state.public.filter;
}

export const selectPosts = (state: RootState) => {
  return state.public.posts;
}

export const selectTotalPostsCount = (state: RootState) => {
  return state.public.totalPostsCount;
}

export const selectLikePostsInProgress = (state: RootState) => {
  return state.public.likePostsInProgress;
}

export const selectEditingPostId = (state: RootState) => {
  return state.public.editingPostId;
}

export const selectComments = (state: RootState) => {
  return state.public.comments;
}

export const selectLikeCommentsInProgress = (state: RootState) => {
  return state.public.likeCommentsInProgress;
}

export const selectEditingCommentId = (state: RootState) => {
  return state.public.editingCommentId;
}

export const selectPostsWithOpenedComments = (state: RootState) => {
  return state.public.postsWithOpenedComments;
}