import { Profile, User } from "./models";

export const convertProfileToUser = (profile: Profile): User => {
  return {
    id: profile.userId,
    login: profile.login,
    photoUrl: profile.photoUrl
  }
}