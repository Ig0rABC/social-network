import React from "react";
import { Form, Button } from 'antd';
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { actions } from "../../redux/reducers/posts";

const PostEditCancelButton = () => {

  const dispatch = useDispatch();

  const handleCancelClick = () => {
    dispatch(actions.resetEditingPostId());
  }

  return (
    <Form.Item>
      <Button onClick={handleCancelClick}>
        <FormattedMessage id="buttons.cancel" defaultMessage="cancel" />
      </Button>
    </Form.Item>
  )
}

export default PostEditCancelButton;