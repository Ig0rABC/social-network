import React, { SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Form, Input, Select } from 'antd';
import { Category } from "../../types/models";
import { setFilter } from "../../redux/actions/public";
import { selectFilter } from "../../redux/selectors/public";
import { buildQueryString } from "../../utils";

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
  const history = useHistory();
  // @ts-ignore
  const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));

  useEffect(() => {
    const search = history.location.search;
    const newFilter = Object.fromEntries(new URLSearchParams(search));
    dispatch(setFilter({ ...filter, ...newFilter }));
  }, [])

  useEffect(() => {
    const newFilter: any = { ...filter };
    delete newFilter.authorId;
    delete newFilter.pageSize;
    if (newFilter.page === 1) {
      delete newFilter.page;
    }
    history.push({
      search: buildQueryString(newFilter)
    })
  }, [filter])

  const handleChange = (selectedItems: SetStateAction<never[]>) => {
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

  return <Form layout="inline"
    initialValues={{ ...filter }}
  >

    <Form.Item name="category">
      <Select value={selectedItems}
        onChange={handleChange}
        onSelect={handleSelect}
        loading={isSubmitting}
        disabled={isSubmitting}
        placeholder={<FormattedMessage id="placeholders.category" />}
        style={{
          minWidth: "10rem"
        }}
      >
        {filteredOptions.map(item => (
          <Select.Option key={item} value={item}>
            <FormattedMessage
              id={"categories." + item}
              defaultMessage={item}
            />
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item>
      <FormattedMessage
        id="placeholders.search"
        defaultMessage="search"
      >
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