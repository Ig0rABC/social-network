import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import { Grid, TextField, IconButton, InputBase, makeStyles, createStyles, Theme } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Search } from "@material-ui/icons";
import { buildQueryString } from "../../utils";
import { setFilter } from "../../redux/actions/public";
import { fetchPosts } from "../../redux/thunks/public";
import { selectFilter, selectPendingPosts } from "../../redux/selectors/public";
import { Category } from "../../types/models";
import { CATEGORIES } from "../../constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center'
    },
    input: {
      marginLeft: theme.spacing(5),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

const PostsSearchForm: React.FC = () => {

  const styles = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();
  const filter = useSelector(selectFilter);
  const pending = useSelector(selectPendingPosts);

  const [category, setCategory] = useState(null as Category | null);
  const [inputCategory, setInputCategory] = useState("");
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

  const handleSearch = () => {
    dispatch(setFilter({ ...filter, search }));
  };

  const handleChangeCategory = (_: any, newCategory: Category | null) => {
    setCategory(newCategory);
    dispatch(setFilter({ ...filter, category: newCategory }));
  }

  return <Grid item component="form" className={styles.root}>
    <Autocomplete
      size="small"
      options={CATEGORIES}
      value={category}
      onChange={handleChangeCategory}
      inputValue={inputCategory}
      onInputChange={(_, newInputCategory) => {
        setInputCategory(newInputCategory);
      }}
      getOptionLabel={(option) => intl.formatMessage({ id: "categories." + option })}
      style={{ width: 250 }}
      renderInput={(params) => <TextField {...params} variant="outlined" />}
      placeholder={intl.formatMessage({ id: "forms.category" })}
    />
    <InputBase
      id="search"
      value={search}
      onChange={({ target }) => setSearch(target.value)}
      disabled={pending}
    />
    <IconButton onClick={handleSearch} color="primary" className={styles.iconButton}>
      <Search />
    </IconButton>
  </Grid>
}

export default PostsSearchForm;