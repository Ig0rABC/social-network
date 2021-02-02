import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { Select, TextField, Button, IconButton, ButtonGroup, Card, CardContent, CardActions, Tooltip } from "@material-ui/core";
import { Cancel, Delete, Save } from "@material-ui/icons";
import { createPost, deletePost, updatePost } from "../../redux/thunks/public";
import { selectPendingPosts } from "../../redux/selectors/public";
import { resetEditingPostId } from "../../redux/actions/public";
import { Category } from "../../types/models";

const CATEGORIES: Category[] = [
  "programming", "travels", "countries",
  "languages", "politics", "news", "blog", "stories",
  "music", "education", "science", "films", "cinema",
  "theater", "tourism", "statistics", "philosophy",
  "literature", "psychology", "other", "no category"
];

type Props = {
  mode: "create" | "edit",
  postId?: number,
  initialValues?: {
    category: Category,
    content: string
  }
}

const PostForm: React.FC<Props> = ({ mode, postId = 0, initialValues = { category: "no category", content: "" } }) => {

  const dispatch = useDispatch();
  const intl = useIntl();
  const pendingPosts = useSelector(selectPendingPosts);
  const [category, setCategory] = useState(initialValues.category);
  const [content, setContent] = useState(initialValues.content);

  const handleCreate = () => {
    dispatch(createPost({ category, content }));
  }

  const handleUpdate = () => {
    dispatch(updatePost({ postId, category, content }));
  }

  const handleCancel = () => {
    dispatch(resetEditingPostId());
  }

  const handleDelete = () => {
    dispatch(deletePost(postId));
  }

  const options = CATEGORIES
    .map(
      c => <option value={c}>
        {intl.formatMessage({ id: "categories." + c })}
      </option>
    )

  return <Card>
    <CardContent>
      <form>
        <Select value={category} onChange={({ target }) => setCategory(target.value as Category)}>
          {options}
        </Select>
        <TextField
          id="content"
          value={content}
          onChange={({ target }) => setContent(target.value)}
          disabled={pendingPosts}
        />
      </form>
    </CardContent>
    <CardActions>
      {
        mode === "create"
          ? <Button onClick={handleCreate} color="primary" variant="contained">
            <FormattedMessage id="buttons.post" />
          </Button>
          : <ButtonGroup>
            <Tooltip arrow placement="top" title={<FormattedMessage id="buttons.save" />}>
              <IconButton onClick={handleUpdate}>
                <Save />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title={<FormattedMessage id="buttons.cancel" />}>
              <IconButton onClick={handleCancel}>
                <Cancel />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="top" title={<FormattedMessage id="buttons.delete" />}>
              <IconButton onClick={handleDelete}>
                <Delete />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
      }
    </CardActions>
  </Card>
}

export default PostForm;