import { InferActions } from "../../types/flux";
import { Post } from "../../types/models";
import { Category, PostOrder } from "../../types/models";

const initialState = {
  posts: [] as Post[],
  filter: {
    authorId: null as number | null,
    category: "programming" as Category,
    search: null as string | null,
    order: [] as PostOrder[],
    page: 1,
    pageSize: 4 as number | undefined

  },
  totalPostsCount: null as number | null
}

type InitialState = typeof initialState;
export type Filter = typeof initialState.filter;

export const actions = {
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
  setFilter: (filter: Filter) => ({
    type: "post/SET-FILTER",
    payload: filter
  } as const)
}

type Action = InferActions<typeof actions>;

const postsReducer = (state = initialState, action: Action): InitialState => {
  switch (action.type) {
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
    case "post/SET-FILTER":
      return {
        ...state,
        filter: action.payload
      }
    default:
      return state;
  }
}

export default postsReducer;