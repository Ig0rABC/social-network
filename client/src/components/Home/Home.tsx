import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFilter } from "../../redux/selectors/public";
import { fetchPosts } from "../../redux/thunks/public";
import Posts from "../Posts/Posts";

const Home: React.FC = () => {

  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);

  useEffect(() => {
    dispatch(fetchPosts(filter));
  }, []);

  return <>
    <Posts />
  </>
}

export default Home;