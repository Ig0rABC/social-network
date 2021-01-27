import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchFeed } from "../../redux/thunks/public";
import Posts from "../Posts/Posts";

const Feed: React.FC = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeed());
  }, []);

  return <>
    <Posts />
  </>
}

export default Feed;