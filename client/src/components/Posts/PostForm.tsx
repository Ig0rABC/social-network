import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Form, Input, Button, Select } from 'antd';
import postsAPI from "../../api/posts";
import { Category } from "../../types/models";
import { TagOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/reducers/posts";

type PostFormValues = {
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

const PostForm: React.FC = () => {

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  let [isSubmitting, setSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  // @ts-ignore
  const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));

  const onFinish = async (values: PostFormValues) => {
    setSubmitting(true);
    try {
      const data = await postsAPI.createPost(values.category, values.content);
      dispatch(actions.addPost(data));
    } catch { }
    setSubmitting(false);
    form.resetFields();
  };

  const handleChange = (selectedItems: any) => {
    setSelectedItems(selectedItems);
  };


  return <Form form={form}
    {...layout}
    initialValues={{ category: "no category", content: "" }}
    onFinish={onFinish}
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
      <Input.TextArea value="dsads" showCount maxLength={1000} minLength={10} />
    </Form.Item>

    <Form.Item {...tailLayout}>
      <Button type="primary" htmlType="submit" disabled={isSubmitting}>
        <FormattedMessage id="buttons.post" defaultMessage="post" />
      </Button>
    </Form.Item>
  </Form>
}

export default React.memo(PostForm);