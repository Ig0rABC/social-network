import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Divider } from "antd";
import { selectCurrentUser, selectIsFollowedOnSelectedUser, selectProfile } from "../../redux/selectors/users";
import { fetchProfile } from "../../redux/thunks/users";
import { createPost } from "../../redux/thunks/public";
import { Profile as ProfileType } from "../../types/models";
import { convertProfileToUser } from "../../types/conversions";
import { PostFormValues } from "../Posts/PostForm";
import Posts from "../Posts/Posts";
import ProfileAvatar from "./ProfileAvatar";
import UserInfo from "./UserInfo/UserInfo";
import FollowButton from "./FollowButton";
import FollowersCount from "./FollowersCount";
import Followings from "../Followings/Followings";
import Preloader from "../Preloader/Preloader";
import PostForm from "../Posts/PostForm";

type Params = {
  userId: string
}

const Profile: React.FC = () => {

  const dispatch = useDispatch();
  const { userId } = useParams<Params>();
  const currentUser = useSelector(selectCurrentUser);
  const profile = useSelector(selectProfile);
  const isFollowed = useSelector(selectIsFollowedOnSelectedUser);
  const selectedUserId = Number(userId);

  useEffect(() => {
    dispatch(fetchProfile(selectedUserId))
  }, [selectedUserId])

  if (isNaN(selectedUserId)) {
    return <Redirect to={"/users/" + currentUser?.id} />
  }
  const isOwnProfile = selectedUserId === currentUser?.id;

  if (profile === null) {
    return <Preloader />
  }
  const { photoUrl, firstName, lastName, login } = profile;
  const username = firstName || lastName
    ? `${login}, ${firstName} ${lastName}`
    : login


  const onFinishCreatingPost = (values: PostFormValues) => {
    dispatch(createPost(values));
  }

  return <Fragment>
    <div>
      <ProfileAvatar
        photoUrl={photoUrl}
      />
      <span>{username}</span>
      {!isOwnProfile
        && <FollowButton
          user={convertProfileToUser(profile)}
          isFollowed={isFollowed}
        />
      }
      <FollowersCount
        followersCount={profile?.followersCount || 0}
      />
    </div>
    <UserInfo
      isOwn={isOwnProfile}
      profile={profile as ProfileType}
    />
    {isOwnProfile
      && <Followings />
    }
    <Divider plain orientation="right">
      <FormattedMessage id="user-posts" />
    </Divider>
    <PostForm onFinish={onFinishCreatingPost} />
    <Posts authorId={selectedUserId} />
  </Fragment>
}

export default Profile;