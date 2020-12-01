import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setFilter } from "../../redux/reducers/posts";
import { requestUserProfile } from "../../redux/reducers/users";
import { selectFilter } from "../../redux/selectors/posts";
import { selectCurrentUser, selectIsAuthorized, selectSelectedUserProfile } from "../../redux/selectors/users";
import { UserProfile } from "../../types/models";
import Posts from "../Posts/Posts";
import ProfileInfo from "./ProfileInfo";

type Params = {
  userId: string
}

const Profile: React.FC = () => {

  const dispatch = useDispatch();
  const isAuthorized = useSelector(selectIsAuthorized);
  const currentUser = useSelector(selectCurrentUser);
  const filter = useSelector(selectFilter);
  const selectedUserProfile = useSelector(selectSelectedUserProfile);
  const { userId } = useParams<Params>();

  const authorId = Number.isNaN(userId)
    ? currentUser.id
    : Number(userId)

  useEffect(() => {
    if (authorId) {
      dispatch(setFilter({ ...filter, authorId }));
    }
    dispatch(requestUserProfile(authorId as number));
    return () => {
      dispatch(setFilter({ ...filter, authorId: null as number | null }));
    }
  }, [])

  return <div>
    <ProfileInfo {...selectedUserProfile as UserProfile}/>
    <Posts isOwnPosts={isAuthorized && (currentUser.id === authorId)} />
  </div>
}

export default Profile;