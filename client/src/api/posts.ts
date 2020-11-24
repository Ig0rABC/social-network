import { Category } from "../types/models";
import api from "./config";
import { buildQueryString } from "./utils";

export default {
  async createPost(category: Category, content: string) {
    const response = await api.post("posts", { category, content });
    return response.data;
  },
  async updatePost(postId: number, content: string) {
    const response = await api.put("posts/" + postId, { content });
    return response.data;
  },
  async deletePost(postId: number) {
    const response = await api.delete("posts/" + postId);
    return response.data;
  },
  async getPosts(authorId: number | null, category: Category | null) {
    const response = await api.get("posts" + buildQueryString({
      authorId, category
    }));
    return response.data;
  }
}