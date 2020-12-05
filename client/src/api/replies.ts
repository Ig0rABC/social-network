import api, { NETWORK_DELAY } from "./config";
import { buildQueryString, sleep } from "./utils";

const repliesAPI = {
  async createReply(commentId: number, content: string) {
    await sleep(NETWORK_DELAY);
    const response = await api.post("replies", { commentId, content });
    return response.data;
  },
  async updateReply(replyId: number, content: string) {
    await sleep(NETWORK_DELAY);
    const response = await api.put("replies/" + replyId, { content });
    return response.data;
  },
  async deleteReply(replyId: number) {
    await sleep(NETWORK_DELAY);
    const response = await api.delete("replies/" + replyId);
    return response.data;
  },
  async getReplies(commentId: number | null, authorId = null as number | null) {
    await sleep(NETWORK_DELAY);
    const response = await api.get("replies" + buildQueryString({
      authorId, commentId
    }));
    return response.data;
  },
  async likeReply(replyId: number) {
    await sleep(NETWORK_DELAY);
    const response = await api.post("likes" + buildQueryString({
      replyId
    }));
    return response.data;
  },
  async unlikeReply(replyId: number) {
    await sleep(NETWORK_DELAY);
    const response = await api.delete("likes" + buildQueryString({
      replyId
    }));
    return response.data;
  }
}

export default repliesAPI;