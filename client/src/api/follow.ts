import api, { NETWORK_DELAY } from "./config";
import { sleep } from "./utils";

const followAPI = {
  async follow(userId: number) {
    await sleep(NETWORK_DELAY);
    const response = await api.post("follow/" + userId);
    return response.data;
  },
  async unfollow(userId: number) {
    await sleep(NETWORK_DELAY);
    const response = await api.delete("follow/" + userId);
    return response.data;
  },
  async getFolowings() {
    await sleep(NETWORK_DELAY);
    const response = await api.get("follow");
    return response.data;
  },
  async getFeed() {
    await sleep(NETWORK_DELAY);
    const response = await api.get("feed");
    return response.data;
  }
}

export default followAPI;