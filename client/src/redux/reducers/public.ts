import { Post, Comment, Category, PostOrder } from "../../types/models";
import { Action } from "../actions/public";

const initialState = {
  isFetching: false,
  posts: [] as Post[],
  totalPostsCount: null as number | null,
  likePostsInProgress: [] as number[],
  editingPostId: null as number | null,
  filter: {
    authorId: null as number | null,
    category: null as Category | null,
    search: null as string | null,
    order: [] as PostOrder[],
    page: 1,
    pageSize: 4
  },
  comments: [] as Comment[],
  likeCommentsInProgress: [] as number[],
  editingCommentId: null as number | null
}

type InitialState = typeof initialState;
export type Filter = typeof initialState.filter;

const publicReducer = (state = initialState, action: Action): InitialState => {
  switch (action.type) {
    case "public/SET-IS-FETCHING":
      return {
        ...state,
        isFetching: action.payload
      }
    case "public/SET-POSTS":
      return {
        ...state,
        posts: action.payload
      }
    case "public/SET-TOTAL-POSTS-COUNT":
      return {
        ...state,
        totalPostsCount: action.payload
      }
    case "public/ADD-NEW-POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        totalPostsCount: state.totalPostsCount as number + 1
      }
    case "public/ADD-SHIFTED-POST":
      return {
        ...state,
        posts: [...state.posts, action.payload]
      }
    case "public/DELETE-POST":
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        totalPostsCount: state.totalPostsCount as number - 1
      }
    case "public/UPDATE-POST":
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
    case "public/SET-EDITING-POST-ID":
      return {
        ...state,
        editingPostId: action.payload
      }
    case "public/RESET-EDITING-POST-ID":
      return {
        ...state,
        editingPostId: initialState.editingPostId
      }
    case "public/TOGGLE-IS-LIKED-POST":
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
    case "public/SET-LIKE-POST-IN-PROGRESS":
      return {
        ...state,
        likePostsInProgress: action.payload.isFetching
          ? [...state.likePostsInProgress, action.payload.postId]
          : state.likePostsInProgress
            .filter(postId => postId !== action.payload.postId)
      }
    case "public/SET-FILTER":
      return {
        ...state,
        filter: action.payload
      }
    case "public/ADD-COMMENTS":
      return {
        ...state,
        comments: [...state.comments, ...action.payload]
      }
    case "public/ADD-NEW-COMMENT":
      return {
        ...state,
        comments: [...state.comments, action.payload],
        posts: state.posts
          .map(post => post.id === action.payload.postId
            ? {
              ...post, commentsCount: post.commentsCount + 1
            } : post
          )
      }
    case "public/DELETE-COMMENT":
      const comment = state.comments.find(comment => comment.id === action.payload);
      const postId = comment?.postId;
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== action.payload),
        posts: state.posts
          .map(post => post.id === postId
            ? {
              ...post,
              commentsCount: post.commentsCount - 1
            } : post
          )
      }
    case "public/UPDATE-COMMENT":
      return {
        ...state,
        comments: state.comments
          .map(comment => comment.id === action.payload.commentId
            ? {
              ...comment,
              content: action.payload.content
            } : comment
          )
      }
    case "public/SET-EDITING-COMMENT-ID":
      return {
        ...state,
        editingCommentId: action.payload
      }
    case "public/RESET-EDITING-COMMENT-ID":
      return {
        ...state,
        editingCommentId: initialState.editingCommentId
      }
    case "public/TOGGLE-IS-LIKED-COMMENT":
      return {
        ...state,
        comments: state.comments
          .map(comment => comment.id === action.payload
            ? {
              ...comment,
              likesCount: comment.isLiked
                ? comment.likesCount - 1
                : comment.likesCount + 1,
              isLiked: !comment.isLiked,
            } : comment
          )
      }
    case "public/SET-LIKE-COMMENT-IN-PROGRESS":
      return {
        ...state,
        likeCommentsInProgress: action.payload.isFetching
          ? [...state.likeCommentsInProgress, action.payload.commentId]
          : state.likeCommentsInProgress
            .filter(commentId => commentId !== action.payload.commentId)
      }
    default:
      return state;
  }
}

export default publicReducer;