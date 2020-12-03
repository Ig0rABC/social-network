import React from "react";
import { Form, Button } from 'antd';
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";

type Props = {
  onClick: () => void
}

const EditCancelButton: React.FC<Props> = ({ onClick }) => {

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(onClick());
  }

  return (
    <Form.Item>
      <Button onClick={handleClick}>
        <FormattedMessage id="buttons.cancel" defaultMessage="cancel" />
      </Button>
    </Form.Item>
  )
}

export default EditCancelButton;