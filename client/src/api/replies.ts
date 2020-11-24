import api from "./config";
import { buildQueryString } from "./utils";

export default {
  async createReply(commentId: number, content: string) {
    const response = await api.post("replies", { commentId, content });
    return response.data;
  },
  async updateReply(replyId: number, content: string) {
    const response = await api.put("replies/" + replyId, { content });
    return response.data;
  },
  async deleteReply(replyId: number) {
    const response = await api.delete("replies/" + replyId);
    return response.data;
  },
  async getReplies(authorId: number | null, commentId: number | null) {
    const response = await api.get("comments" + buildQueryString({
      authorId, commentId
    }));
    return response.data;
  }
}