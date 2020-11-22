export type User = {
  login: string,
  photoUrl: string
}

export type Post = {
  id: number,
  category: string,
  content: string,
  author: User,
  created: Date,
  commentsCount: number,
  likesCount: number
}

export type Comment = {
  id: number,
  postId: number,
  content: string,
  author: User,
  created: Date,
  repliesCount: number,
  likesCount: number
}

export type Reply = {
  id: number,
  commentId: number,
  content: string,
  author: User,
  created: Date,
  likesCount: number
}