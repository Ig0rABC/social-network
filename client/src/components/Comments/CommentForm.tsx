import React from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Button, Form, Input } from "antd";
import { selectPendingPosts } from "../../redux/selectors/public";

export type CommentFormValues = {
  content: string
}

type Props = {
  onFinish: (values: CommentFormValues) => void,
  initialValues?: {
    content: string
  },
  extraElements?: JSX.Element[]
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { offset: 3, span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const CommentForm: React.FC<Props> = ({ onFinish, initialValues = { content: "" }, extraElements = [] }) => {

  const [form] = Form.useForm();
  const pending = useSelector(selectPendingPosts);

  return <Form form={form}
    {...layout}
    initialValues={initialValues}
    onFinish={(values) => {
      onFinish(values);
      form.resetFields();
    }}
  >

    <Form.Item name="content"
      rules={[
        {
          required: true,
          message: <FormattedMessage id="empty-comment" defaultMessage="empty comment" />
        }
      ]}
    >
      <Input.TextArea showCount maxLength={500} minLength={10} />
    </Form.Item>

    <Form.Item {...tailLayout}>
      <Button type="primary" htmlType="submit" disabled={pending}>
        <FormattedMessage id="buttons.comment" defaultMessage="comment" />
      </Button>
    </Form.Item>

    {extraElements}

  </Form>
}

export default CommentForm;