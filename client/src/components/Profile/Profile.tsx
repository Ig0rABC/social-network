import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCurrentUser, selectIsFollowedOnSelectedUser, selectSelectedUserProfile } from "../../redux/selectors/users";
import { requestUserProfile } from "../../redux/thunks/users";
import { User, UserProfile } from "../../types/models";
import Posts from "../Posts/Posts";
import ProfileAvatar from "./ProfileAvatar";
import UserInfo from "./UserInfo/UserInfo";
import ToggleFollowButton from "./ToggleFollowButton";
import FollowersCount from "./FollowersCount";
import Followings from "../../Followings/Followings";

type Params = {
  userId: string
}

const Profile: React.FC = () => {

  const dispatch = useDispatch();
  const { userId } = useParams<Params>();
  const currentUser = useSelector(selectCurrentUser);
  const selectedUserProfile = useSelector(selectSelectedUserProfile);
  const isFollowed = useSelector(selectIsFollowedOnSelectedUser);

  const selectedUserId = Number.isNaN(userId)
    ? currentUser.id as number
    : Number(userId)
  const isOwnProfile = selectedUserId === currentUser.id;

  useEffect(() => {
    dispatch(requestUserProfile(selectedUserId))
  }, [selectedUserId])

  return <div>
    <ProfileAvatar photoUrl={currentUser.photoUrl} />
    {isOwnProfile
      || <ToggleFollowButton user={selectedUserProfile as User} isFollowed={isFollowed} />
    }
    <FollowersCount followersCount={selectedUserProfile.followersCount} />
    <UserInfo profile={selectedUserProfile as UserProfile} />
    {isOwnProfile && <Followings />}
    <Posts authorId={selectedUserId} />
  </div>
}

export default Profile;