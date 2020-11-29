import postsAPI from "../../api/posts";
import { InferActions, Thunk } from "../../types/flux";
import { Post } from "../../types/models";
import { Category, PostOrder } from "../../types/models";

const initialState = {
  isFetching: false,
  posts: [] as Post[],
  totalPostsCount: null as number | null,
  likesInProgress: [] as number[],
  editingPostId: null as number | null,
  filter: {
    authorId: null as number | null,
    category: null as Category | null,
    search: null as string | null,
    order: [] as PostOrder[],
    page: 1,
    pageSize: 4
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
  addNewPost: (post: Post) => ({
    type: "posts/ADD-NEW-POST",
    payload: post
  } as const),
  deletePost: (postId: number) => ({
    type: "posts/DELETE-POST",
    payload: postId
  } as const),
  addShiftedPost: (post: Post) => ({
    type: "posts/ADD-SHIFTED-POST",
    payload: post
  } as const),
  updatePost: (postId: number, category: Category, content: string) => ({
    type: "posts/UPDATE-POST",
    payload: {
      postId,
      category,
      content
    }
  } as const),
  setEditingPostId: (postId: number) => ({
    type: "posts/SET-EDITING-POST-ID",
    payload: postId
  } as const),
  resetEditingPostId: () => ({
    type: "posts/RESET-EDITING-POST-ID"
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
    case "posts/ADD-NEW-POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        totalPostsCount: state.totalPostsCount as number + 1
      }
    case "posts/ADD-SHIFTED-POST":
      return {
        ...state,
        posts: [...state.posts, action.payload]
      }
    case "posts/DELETE-POST":
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        totalPostsCount: state.totalPostsCount as number - 1
      }
    case "posts/UPDATE-POST":
      return {
        ...state,
        posts: state.posts
          .map(post => post.id === action.payload.postId
            ? {
              ...post,
              category: action.payload.category,
              content: action.payload.content
            } : post
          )
      }
    case "posts/SET-EDITING-POST-ID":
      return {
        ...state,
        editingPostId: action.payload
      }
    case "posts/RESET-EDITING-POST-ID":
      return {
        ...state,
        editingPostId: initialState.editingPostId
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