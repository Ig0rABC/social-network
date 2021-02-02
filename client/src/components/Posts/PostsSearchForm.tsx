import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import { Paper, Select, TextField, IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { buildQueryString } from "../../utils";
import { setFilter } from "../../redux/actions/public";
import { fetchPosts } from "../../redux/thunks/public";
import { selectFilter, selectPendingPosts } from "../../redux/selectors/public";
import { Category } from "../../types/models";

const CATEGORIES: Category[] = [
  "programming", "travels", "countries",
  "languages", "politics", "news", "blog", "stories",
  "music", "education", "science", "films", "cinema",
  "theater", "tourism", "statistics", "philosophy",
  "literature", "psychology", "other", "no category"
];

const PostsSearchForm: React.FC = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();
  const filter = useSelector(selectFilter);
  const pending = useSelector(selectPendingPosts);

  const [category, setCategory] = useState(null as Category | null);
  const [search, setSearch] = useState("");

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
    };
    history.push({
      search: buildQueryString(newFilter)
    });
    dispatch(fetchPosts(filter));
  }, [filter])

  const options = CATEGORIES
    .map(
      c => <option value={c}>
        {intl.formatMessage({ id: "categories." + c })}
      </option>
    )

  const handleSearch = () => {
    dispatch(setFilter({ ...filter, search }));
  };

  const handleChangeCategory = ({ target }: any) => {
    setCategory(target.value as Category);
    dispatch(setFilter({ ...filter, category: target.value as Category }));
  }

  return <Paper>
    <form>
      <Select value={category} onChange={handleChangeCategory}>
        {options}
      </Select>
      <TextField
        id="search"
        value={search}
        onChange={({ target }) => setSearch(target.value)}
        disabled={pending}
      />
      <IconButton onClick={handleSearch} disabled={pending}>
        <Search />
      </IconButton>
    </form>
  </Paper>
}

export default PostsSearchForm;