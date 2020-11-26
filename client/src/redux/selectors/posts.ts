import { RootState } from "../store";

export const selectFilter = (state: RootState) => {
  return state.posts.filter;
}

export const selectPosts = (state: RootState) => {
  return state.posts.posts;
}

export const selectTotalPostsCount = (state: RootState) => {
  return state.posts.totalPostsCount;
}