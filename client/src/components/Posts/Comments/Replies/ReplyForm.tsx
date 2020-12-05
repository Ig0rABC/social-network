import React from "react";
import { FormattedMessage } from "react-intl";
import { Button, Form, Input } from "antd";
import { useSelector } from "react-redux";
import { selectIsFetching } from "../../../../redux/selectors/public";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { offset: 3, span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export type ReplyFormValues = {
  content: string
}

type Props = {
  onFinish: (values: ReplyFormValues) => void,
  initialValues?: ReplyFormValues,
  extraElements?: JSX.Element[]
}

const ReplyForm: React.FC<Props> = ({ onFinish, initialValues = { content: "" }, extraElements = [] }) => {

  const [form] = Form.useForm();
  const isFetcing = useSelector(selectIsFetching);

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
          message: <FormattedMessage id="empty-reply" defaultMessage="empty reply" />
        }
      ]}
    >
      <Input.TextArea showCount maxLength={250} minLength={10} />
    </Form.Item>

    <Form.Item {...tailLayout}>
      <Button type="primary" htmlType="submit" disabled={isFetcing}>
        <FormattedMessage id="buttons.reply" defaultMessage="reply" />
      </Button>
    </Form.Item>

    {extraElements}

  </Form>
}

export default ReplyForm;