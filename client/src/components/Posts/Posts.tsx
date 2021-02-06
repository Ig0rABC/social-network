import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import {
  selectFilter, selectPendingPosts, selectPosts,
  selectTotalPostsCount, selectPendingLikePosts,
  selectEditingPostId, selectOpenedComments
} from "../../redux/selectors/public";
import { fetchShiftedPost } from "../../redux/thunks/public";
import { selectCurrentUser, selectIsAuthorized } from "../../redux/selectors/users";
import PostsSearchForm from "./PostsSearchForm";
import Post from "./Post";

const Posts: React.FC = () => {

  const dispatch = useDispatch();
  const isAuthorized = useSelector(selectIsAuthorized);
  const currentUser = useSelector(selectCurrentUser);
  const pending = useSelector(selectPendingPosts);
  const filter = useSelector(selectFilter);
  const posts = useSelector(selectPosts);
  const totalCount = useSelector(selectTotalPostsCount) as number;
  const pendingLikes = useSelector(selectPendingLikePosts);
  const editingPostId = useSelector(selectEditingPostId);
  const openedComments = useSelector(selectOpenedComments);

  useEffect(() => {
    const pagesCount = Math.ceil(totalCount / filter.pageSize);
    if (!pending &&
      posts.length > 0 &&
      posts.length < filter.pageSize &&
      filter.page < pagesCount) {
      dispatch(fetchShiftedPost(filter));
    }
  }, [posts.length])

  return <Grid container direction="column" spacing={2}>
    <PostsSearchForm />
    {
      posts.map(post => <Post key={post.id} post={post}
        editMode={post.id === editingPostId}
        openedComments={openedComments.includes(post.id)}
        pendingLike={pendingLikes.includes(post.id)}
        isAuthorized={isAuthorized}
        currentUserId={currentUser?.id || 0}
      />)
    }
  </Grid>
}

export default Posts;