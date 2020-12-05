import api, { NETWORK_DELAY } from "./config";
import { buildQueryString, sleep } from "./utils";

const commentsAPI = {
  async createComment(postId: number, content: string) {
    await sleep(NETWORK_DELAY);
    const response = await api.post("comments", { postId, content });
    return response.data;
  },
  async updateComment(commentId: number, content: string) {
    await sleep(NETWORK_DELAY);
    const response = await api.put("comments/" + commentId, { content });
    return response.data;
  },
  async deleteComment(commentId: number) {
    await sleep(NETWORK_DELAY);
    const response = await api.delete("comments/" + commentId);
    return response.data;
  },
  async getComments(postId: number | null, authorId: number | null,) {
    await sleep(NETWORK_DELAY);
    const response = await api.get("comments" + buildQueryString({
      authorId, postId
    }));
    return response.data;
  },
  async likeComment(commentId: number) {
    await sleep(NETWORK_DELAY);
    const response = await api.post("likes" + buildQueryString({
      commentId
    }));
    return response.data;
  },
  async unlikeComment(commentId: number) {
    await sleep(NETWORK_DELAY);
    const response = await api.delete("likes" + buildQueryString({
      commentId
    }));
    return response.data;
  }
}

export default commentsAPI;