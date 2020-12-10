import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCurrentUser, selectSelectedUserProfile } from "../../redux/selectors/users";
import { requestUserProfile } from "../../redux/thunks/users";
import { UserProfile } from "../../types/models";
import Posts from "../Posts/Posts";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import ToggleFollowButton from "./ToggleFollowButton";

type Params = {
  userId: string
}

const Profile: React.FC = () => {

  const dispatch = useDispatch();
  const { userId } = useParams<Params>();
  const currentUser = useSelector(selectCurrentUser);
  const selectedUserProfile = useSelector(selectSelectedUserProfile);

  const authorId = Number.isNaN(userId)
    ? currentUser.id as number
    : Number(userId)

  useEffect(() => {
    dispatch(requestUserProfile(authorId))
  }, [authorId])

  return <div>
    <ProfileAvatar photoUrl={currentUser.photoUrl as string} />
    <ToggleFollowButton userId={authorId} isFollowed={selectedUserProfile.isFollowed} />
    {<ProfileInfo profile={selectedUserProfile as UserProfile} />}
    <Posts authorId={authorId} />
  </div>
}

export default Profile;