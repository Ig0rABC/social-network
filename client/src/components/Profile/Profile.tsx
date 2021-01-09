import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Divider } from "antd";
import { selectCurrentUser, selectIsFollowedOnSelectedUser, selectSelectedProfile } from "../../redux/selectors/users";
import { requestProfile } from "../../redux/thunks/users";
import { Profile as ProfileType } from "../../types/models";
import { convertProfileToUser } from "../../types/conversions";
import Posts from "../Posts/Posts";
import ProfileAvatar from "./ProfileAvatar";
import UserInfo from "./UserInfo/UserInfo";
import ToggleFollowButton from "./ToggleFollowButton";
import FollowersCount from "./FollowersCount";
import Followings from "../Followings/Followings";

type Params = {
  userId: string
}

const Profile: React.FC = () => {

  const dispatch = useDispatch();
  const { userId } = useParams<Params>();
  const currentUser = useSelector(selectCurrentUser);
  const selectedProfile = useSelector(selectSelectedProfile);
  const isFollowed = useSelector(selectIsFollowedOnSelectedUser);
  const selectedUserId = Number(userId);

  useEffect(() => {
    dispatch(requestProfile(selectedUserId))
  }, [selectedUserId])

  if (isNaN(selectedUserId)) {
    return <Redirect to={"/users/" + currentUser.id} />
  }
  const isOwnProfile = selectedUserId === currentUser.id;

  const { photoUrl, firstName, lastName, login } = selectedProfile;
  const username = firstName || lastName
    ? `${login}, ${firstName} ${lastName}`
    : login

  return <Fragment>
    <div>
      <ProfileAvatar
        photoUrl={photoUrl}
      />
      <span>{username}</span>
      {!isOwnProfile
        && <ToggleFollowButton
          user={convertProfileToUser(selectedProfile as ProfileType)}
          isFollowed={isFollowed}
        />
      }
      <FollowersCount
        followersCount={selectedProfile.followersCount}
      />
    </div>
    <UserInfo
      isOwn={isOwnProfile}
      profile={selectedProfile as ProfileType}
    />
    {isOwnProfile
      && <Followings />
    }
    <Divider plain orientation="right">
      <FormattedMessage id="user-posts" />
    </Divider>
    <Posts authorId={selectedUserId} />
  </Fragment>
}

export default Profile;