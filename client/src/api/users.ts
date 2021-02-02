import api, { NETWORK_DELAY } from "./config";
import { getObjectWithoutNullProps } from "../utils";
import { UserInfoFormValues } from "../components/Profile/UserInfo/UserInfoForm";
import { Profile, User } from "../types/models";
import { sleep } from "./utils";

const usersAPI = {
  async register(login: string, password: string): Promise<{}> {
    await sleep(NETWORK_DELAY);
    const response = await api.post("users/register", { login, password });
    return response.data;
  },
  async login(login: string, password: string, rememberMe: boolean): Promise<{}> {
    await sleep(NETWORK_DELAY);
    const response = await api.post("users/login", { login, password, rememberMe });
    return response.data;
  },
  async me(): Promise<User> {
    await sleep(2000);
    const response = await api.get("users/me");
    return response.data;
  },
  async logout(): Promise<{}> {
    await sleep(NETWORK_DELAY);
    const response = await api.delete("users/login");
    return response.data;
  },
  async getProfile(userId: number): Promise<Profile> {
    await sleep(NETWORK_DELAY);
    const response = await api.get("users/" + userId);
    return response.data;
  },
  async updateProfile(profile: UserInfoFormValues): Promise<Profile> {
    const userInfo = getObjectWithoutNullProps(profile);
    await sleep(NETWORK_DELAY);
    const response = await api.put("users", { ...userInfo });
    return response.data;
  }
}

export default usersAPI;