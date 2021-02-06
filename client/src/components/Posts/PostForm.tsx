import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField, Button, IconButton, ButtonGroup, Card, CardContent, CardActions, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Cancel, Delete, Save } from "@material-ui/icons";
import { createPost, deletePost, updatePost } from "../../redux/thunks/public";
import { resetEditingPostId } from "../../redux/actions/public";
import { Category } from "../../types/models";
import { CATEGORIES } from "../../constants";

type Props = {
  mode: "create" | "edit",
  postId?: number,
  initialValues?: {
    category: Category,
    content: string
  }
}

const PostForm: React.FC<Props> = ({ mode, postId = 0, initialValues = { category: "no category", content: "" } }) => {

  if (mode === "edit" && !postId) {
    throw TypeError("Property 'postId' is required if you specify mode 'edit' in PostForm props");
  }

  const dispatch = useDispatch();
  const intl = useIntl();
  const [category, setCategory] = useState(initialValues.category as Category);
  const [inputCategory, setInputCategory] = useState("");
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

  const handleChangeCategory = (_: any, newCategory: Category | null) => {
    if (newCategory !== null) {
      setCategory(newCategory);
    }
  }

  return <Card>
    <CardContent component="form">
      <Autocomplete
        size="small"
        options={CATEGORIES}
        value={category}
        onChange={handleChangeCategory}
        inputValue={inputCategory}
        onInputChange={(_, newInputCategory) => {
          setInputCategory(newInputCategory);
        }}
        getOptionLabel={(option) => intl.formatMessage({ id: "categories." + option })}
        style={{ width: 250 }}
        renderInput={(params) => <TextField {...params} variant="outlined" />}
        placeholder={intl.formatMessage({ id: "forms.category" })}
      />
      <TextField
        value={content}
        onChange={({ target }) => setContent(target.value)}
        style={{ width: 250 }}
        multiline
        rows={content.split("\n").length}
      />
    </CardContent>
    <CardActions>
      {mode === "create" &&
        <Button onClick={handleCreate} color="primary" variant="contained">
          <FormattedMessage id="buttons.post" />
        </Button>
      }
      {mode === "edit" &&
        <ButtonGroup>
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