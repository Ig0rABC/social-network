import { Profile, User } from "./models";

export const convertProfileToUser = (profile: Profile | null): User | null => {
  if (profile === null) {
    return null;
  }
  return {
    id: profile.userId,
    login: profile.login,
    photoUrl: profile.photoUrl
  }
}