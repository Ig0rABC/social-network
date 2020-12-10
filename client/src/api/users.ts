import { ProfileInfoFormValues } from "../components/Profile/ProfileInfo/ProfileInfoForm";
import { getObjectWithoutNullProps } from "../utils";
import api, { NETWORK_DELAY } from "./config";
import { sleep } from "./utils";

const usersAPI = {
  async register(login: string, password: string) {
    await sleep(NETWORK_DELAY);
    const response = await api.post("users/register", { login, password });
    return response.data;
  },
  async login(login: string, password: string, rememberMe: boolean) {
    await sleep(NETWORK_DELAY);
    const response = await api.post("users/login", { login, password, rememberMe });
    return response.data;
  },
  async me() {
    await sleep(2000);
    const response = await api.get("users/me");
    return response.data;
  },
  async logout() {
    await sleep(NETWORK_DELAY);
    const response = await api.delete("users/login");
    return response.data;
  },
  async getUserProfile(userId: number) {
    await sleep(NETWORK_DELAY);
    const response = await api.get("users/" + userId);
    return response.data;
  },
  async updateUserProfile(profile: ProfileInfoFormValues) {
    const profileInfo = getObjectWithoutNullProps(profile);
    await sleep(NETWORK_DELAY);
    const response = await api.put("users", { ...profileInfo });
    return response.data;
  }
}

export default usersAPI;