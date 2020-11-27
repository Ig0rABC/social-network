import { Category } from "../types/models";
import api from "./config";
import { buildQueryString, sleep } from "./utils";
import { Filter } from "../redux/reducers/posts";

const postsAPI = {
  async createPost(category: Category, content: string) {
    await sleep(2000);
    const response = await api.post("posts", { category, content });
    return response.data;
  },
  async updatePost(postId: number, category: Category, content: string) {
    await sleep(2000);
    const response = await api.put("posts/" + postId, { category, content });
    return response.data;
  },
  async deletePost(postId: number) {
    await sleep(2000);
    const response = await api.delete("posts/" + postId);
    return response.data;
  },
  async getPosts(filter: Filter) {
    await sleep(2000);
    const response = await api.get("posts" + buildQueryString({
      category: filter.category,
      page: filter.page,
      pageSize: filter.pageSize as number
    }));
    return response.data;
  },
  async likePost(postId: number) {
    await sleep(2000);
    const response = await api.post("likes" + buildQueryString({
      postId
    }));
    return response.data;
  },
  async unlikePost(postId: number) {
    await sleep(2000);
    const response = await api.delete("likes" + buildQueryString({
      postId
    }));
    return response.data;
  },
}

export default postsAPI;