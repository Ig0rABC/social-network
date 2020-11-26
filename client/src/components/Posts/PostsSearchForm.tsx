import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Form, Input, Select } from 'antd';
import { Category } from "../../types/models";
import { TagOutlined } from "@ant-design/icons";
import { PostOrder } from "../../types/models";
import { useSelector } from "react-redux";
import { selectFilter } from "../../redux/selectors/posts";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { offset: 3, span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const OPTIONS: Category[] = [
  "programming", "travels", "countries",
  "languages", "politics", "news", "blog", "stories",
  "music", "education", "science", "films", "cinema",
  "theater", "tourism", "statistics", "philosophy",
  "literature", "psychology", "other", "no category"
];

type Props = {
  handleSearch: (value: string) => void,
  isSubmitting: boolean
}

const PostsSearchForm: React.FC<Props> = ({ handleSearch, isSubmitting }) => {

  const filter = useSelector(selectFilter);
  const [selectedItems, setSelectedItems] = useState([]);
  // @ts-ignore
  const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));

  const handleChange = (selectedItems: any) => {
    setSelectedItems(selectedItems);
  };

  return <Form {...layout}
    initialValues={{ ...filter }}
  >

    <Form.Item name="category">
      <Select value={selectedItems}
        onChange={handleChange}
        suffixIcon={<TagOutlined />}
      >
        {filteredOptions.map(item => (
          <Select.Option key={item} value={item}>
            <FormattedMessage id={"categories." + item} defaultMessage={item} />
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item {...tailLayout}>
      <FormattedMessage id="placeholders.search" defaultMessage="search">
        {(message: string) => (
          <Input.Search
            placeholder={message}
            onSearch={handleSearch}
            loading={isSubmitting}
          />
        )}
      </FormattedMessage>

    </Form.Item>

  </Form>
}

export default PostsSearchForm;