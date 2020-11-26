import postsAPI from "../../api/posts";
import { InferActions, Thunk } from "../../types/flux";
import { Post } from "../../types/models";
import { Category, PostOrder } from "../../types/models";

const initialState = {
  isFetching: false,
  posts: [] as Post[],
  totalPostsCount: null as number | null,
  likesInProgress: [] as number[],
  filter: {
    authorId: null as number | null,
    category: "programming" as Category,
    search: null as string | null,
    order: [] as PostOrder[],
    page: 1,
    pageSize: 4 as number | undefined
  }
}

type InitialState = typeof initialState;
export type Filter = typeof initialState.filter;

export const actions = {
  setIsFetching: (isFetching: boolean) => ({
    type: "posts/SET-IS-FETCHING",
    payload: isFetching
  } as const),
  setPosts: (posts: Post[]) => ({
    type: "posts/SET-POSTS",
    payload: posts
  } as const),
  setTotalPostsCount: (totalPostsCount: number) => ({
    type: "posts/SET-TOTAL-POSTS-COUNT",
    payload: totalPostsCount
  } as const),
  addPost: (post: Post) => ({
    type: "posts/ADD-POST",
    payload: post
  } as const),
  toggleIsLikedPost: (postId: number) => ({
    type: "posts/TOGGLE-IS-LIKED-POST",
    payload: postId
  } as const),
  setLikeInProgress: (postId: number, isFetching: boolean) => ({
    type: "posts/SET-LIKE-IN-PROGRESS",
    payload: {
      postId,
      isFetching
    }
  } as const),
  setFilter: (filter: Filter) => ({
    type: "posts/SET-FILTER",
    payload: filter
  } as const)
}

type Action = InferActions<typeof actions>;

const postsReducer = (state = initialState, action: Action): InitialState => {
  switch (action.type) {
    case "posts/SET-IS-FETCHING":
      return {
        ...state,
        isFetching: action.payload
      }
    case "posts/SET-POSTS":
      return {
        ...state,
        posts: action.payload
      }
    case "posts/SET-TOTAL-POSTS-COUNT":
      return {
        ...state,
        totalPostsCount: action.payload
      }
    case "posts/ADD-POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      }
    case "posts/TOGGLE-IS-LIKED-POST":
      return {
        ...state,
        posts: state.posts
          .map(post => post.id === action.payload
            ? {
              ...post,
              likesCount: post.isLiked
                ? post.likesCount - 1
                : post.likesCount + 1,
              isLiked: !post.isLiked,
            } : post
          )
      }
    case "posts/SET-LIKE-IN-PROGRESS":
      return {
        ...state,
        likesInProgress: action.payload.isFetching
          ? [...state.likesInProgress, action.payload.postId]
          : state.likesInProgress
            .filter(postId => postId !== action.payload.postId)
      }
    case "posts/SET-FILTER":
      return {
        ...state,
        filter: action.payload
      }
    default:
      return state;
  }
}

export default postsReducer;

export const requestPosts = (filter: Filter): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setIsFetching(true));
  const data = await postsAPI.getPosts(filter);
  dispatch(actions.setPosts(data.posts));
  dispatch(actions.setTotalPostsCount(data.totalCount));
  dispatch(actions.setIsFetching(false));
}

export const toggleIsLikedPost = (postId: number, isLiked: boolean): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setLikeInProgress(postId, true));
  if (isLiked) {
    await postsAPI.unlikePost(postId);
  } else {
    await postsAPI.likePost(postId);
  }
  dispatch(actions.toggleIsLikedPost(postId));
  dispatch(actions.setLikeInProgress(postId, false));
}