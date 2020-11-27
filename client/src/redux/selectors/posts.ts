import { RootState } from "../store";

export const selectIsFetching = (state: RootState) => {
  return state.posts.isFetching;
}

export const selectFilter = (state: RootState) => {
  return state.posts.filter;
}

export const selectPosts = (state: RootState) => {
  return state.posts.posts;
}

export const selectTotalPostsCount = (state: RootState) => {
  return state.posts.totalPostsCount;
}

export const selectLikesInProgress = (state: RootState) => {
  return state.posts.likesInProgress;
}

export const selectEditingPostId = (state: RootState) => {
  return state.posts.editingPostId;
}