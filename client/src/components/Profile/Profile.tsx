import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCurrentUser } from "../../redux/selectors/users";
import Posts from "../Posts/Posts";
import ProfileInfo from "./ProfileInfo";

type Params = {
  userId: string
}

const Profile: React.FC = () => {

  const currentUser = useSelector(selectCurrentUser);
  const { userId } = useParams<Params>();

  const authorId = Number.isNaN(userId)
    ? currentUser.id as number
    : Number(userId)

  return <div>
    <ProfileInfo userId={authorId} />
    <Posts authorId={authorId} />
  </div>
}

export default Profile;