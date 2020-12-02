import React, { SetStateAction, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Form, Input, Select } from 'antd';
import { Category } from "../../types/models";
import { useDispatch, useSelector } from "react-redux";
import { selectFilter } from "../../redux/selectors/posts";
import { setFilter } from "../../redux/reducers/posts";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { offset: 3, span: 16 },
};

const OPTIONS: Category[] = [
  "programming", "travels", "countries",
  "languages", "politics", "news", "blog", "stories",
  "music", "education", "science", "films", "cinema",
  "theater", "tourism", "statistics", "philosophy",
  "literature", "psychology", "other", "no category"
];

type Props = {
  isSubmitting: boolean,
  authorId?: number
}

const PostsSearchForm: React.FC<Props> = ({ isSubmitting }) => {

  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const [selectedItems, setSelectedItems] = useState([]);
  // @ts-ignore
  const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));

  const handleChange = (selectedItems:  SetStateAction<never[]>) => {
    setSelectedItems(selectedItems);
  };

  const handleSearch = (search: string | null) => {
    if (search === "") {
      search = null;
    }
    dispatch(setFilter({ ...filter, search }));
  };

  const handleSelect = (category: Category) => {
    dispatch(setFilter({ ...filter, category }));
  };

  return <Form {...layout}
    initialValues={{ ...filter }}
  >

    <Form.Item name="category">
      <Select value={selectedItems}
        onChange={handleChange}
        onSelect={handleSelect}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {filteredOptions.map(item => (
          <Select.Option key={item} value={item}>
            <FormattedMessage id={"categories." + item} defaultMessage={item} />
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item>
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