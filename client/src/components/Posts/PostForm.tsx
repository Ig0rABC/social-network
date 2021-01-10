import React, { SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Form, Input, Button, Select } from 'antd';
import { TagOutlined } from "@ant-design/icons";
import { Category } from "../../types/models";
import { selectPendingPosts } from "../../redux/selectors/public";

export type PostFormValues = {
  category: Category,
  content: string
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { offset: 3, span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const OPTIONS = [
  "programming", "travels", "countries",
  "languages", "politics", "news", "blog", "stories",
  "music", "education", "science", "films", "cinema",
  "theater", "tourism", "statistics", "philosophy",
  "literature", "psychology", "other", "no category"
];

type Props = {
  onFinish: (values: PostFormValues) => void,
  initialValues?: {
    category: Category,
    content: string
  },
  extraElements?: JSX.Element[]
}

const PostForm: React.FC<Props> = ({ onFinish, initialValues = { category: "no category", content: "" }, extraElements = [] }) => {

  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState([]);
  const pendingPosts = useSelector(selectPendingPosts);
  // @ts-ignore
  const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));

  const handleChange = (selectedItems: SetStateAction<never[]>) => {
    setSelectedItems(selectedItems);
  };

  return <Form form={form}
    {...layout}
    initialValues={initialValues}
    onFinish={(values) => {
      onFinish(values);
      form.resetFields();
    }}
  >

    <Form.Item name="category">
      <Select value={selectedItems}
        onChange={handleChange}
        suffixIcon={<TagOutlined />}
      >
        {filteredOptions.map(item => (
          <Select.Option key={item} value={item} >
            <FormattedMessage id={"categories." + item} defaultMessage={item} />
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item name="content"
      rules={[
        {
          required: true,
          message: <FormattedMessage id="empty-post" defaultMessage="empty post" />
        }
      ]}
    >
      <Input.TextArea showCount maxLength={1000} minLength={10} />
    </Form.Item>

    <Form.Item {...tailLayout}>
      <Button type="primary" htmlType="submit" disabled={pendingPosts}>
        <FormattedMessage id="buttons.post" defaultMessage="post" />
      </Button>
    </Form.Item>

    {extraElements}

  </Form>
}

export default React.memo(PostForm);