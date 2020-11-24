import api from "./config";
import { buildQueryString } from "./utils";

export default {
  async createComment(postId: number, content: string) {
    const response = await api.post("comments", { postId, content });
    return response.data;
  },
  async updateComment(commentId: number, content: string) {
    const response = await api.put("comments/" + commentId, { content });
    return response.data;
  },
  async deleteComment(commentId: number) {
    const response = await api.delete("comments/" + commentId);
    return response.data;
  },
  async getComments(authorId: number | null, postId: number | null) {
    const response = await api.get("comments" + buildQueryString({
      authorId, postId
    }));
    return response.data;
  }
}