import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Grid, Avatar, Card, CardActions, CardContent, CardHeader, IconButton, Tooltip, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Comment, Delete, Edit, Favorite, FavoriteBorder } from "@material-ui/icons";
import { setEditingPostId, openComments } from "../../redux/actions/public";
import { Post as PostType } from "../../types/models";
import { deletePost, fetchComments, setIsLikedPost } from "../../redux/thunks/public";
import PostForm from "./PostForm";
import Comments from "../Comments/Comments";

type Props = {
  post: PostType,
  isAuthorized: boolean,
  currentUserId: number,
  editMode: boolean,
  pendingLike: boolean,
  openedComments: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    largePhoto: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    }
  })
)

const Post: React.FC<Props> = ({ post, editMode, openedComments, pendingLike, ...props }) => {

  const dispatch = useDispatch();
  const styles = useStyles();

  const isOwn = props.currentUserId === post.author.id;

  const handleLikeClick = () => {
    dispatch(setIsLikedPost({
      postId: post.id,
      isLiked: !post.isLiked
    }));
  }

  const handleCommentsClick = () => {
    if (!openedComments) {
      if (post.commentsCount > 0) {
        dispatch(fetchComments({ postId: post.id }));
      } else {
        dispatch(openComments(post.id));
      }
    }
  }

  const handleEditClick = () => {
    dispatch(setEditingPostId(post.id));
  }

  const handleDeleteClick = () => {
    dispatch(deletePost(post.id));
  }

  if (editMode) return <PostForm
    mode="edit"
    postId={post.id}
    initialValues={{
      category: post.category,
      content: post.content
    }}
  />

  return <Grid item>
    <Card>
      <CardHeader
        avatar={<Avatar className={styles.largePhoto} src={post.author.photoUrl}>{post.author.id}</Avatar>}
        title={<NavLink to={"/users/" + post.author.id}>{post.author.login}</NavLink>}
        subheader={post.created}
      />
      <CardContent>
        <Typography variant="body2" color="textPrimary" component="p">
          {post.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Tooltip arrow placement="top" title={<FormattedMessage id={post.isLiked ? "buttons.unlike" : "buttons.like"} />}>
          <IconButton disabled={pendingLike} onClick={handleLikeClick}>
            {post.isLiked
              ? <Favorite color="secondary" />
              : <FavoriteBorder />
            }
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top" title={<FormattedMessage id="buttons.view-comments" />}>
          <IconButton onClick={handleCommentsClick}>
            <Comment />
          </IconButton>
        </Tooltip>
        {isOwn && <Fragment>
          <Tooltip arrow placement="top" title={<FormattedMessage id="buttons.edit" />}>
            <IconButton onClick={handleEditClick}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="top" title={<FormattedMessage id="buttons.delete" />}>
            <IconButton onClick={handleDeleteClick}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Fragment>
        }
      </CardActions>
    </Card>
    {openedComments && <Comments postId={post.id} {...props} />}
  </Grid>
}

export default Post;