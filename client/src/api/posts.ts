import api, { NETWORK_DELAY } from "./config";
import { buildQueryString, sleep } from "./utils";
import { Category, Post } from "../types/models";
import { Filter } from "../redux/reducers/public";

const postsAPI = {
  async createPost(category: Category, content: string): Promise<Post> {
    await sleep(NETWORK_DELAY);
    const response = await api.post("posts", { category, content });
    return response.data;
  },
  async updatePost(postId: number, category: Category, content: string) {
    await sleep(NETWORK_DELAY);
    const response = await api.put("posts/" + postId, { category, content });
    return response.data;
  },
  async deletePost(postId: number): Promise<{}> {
    await sleep(NETWORK_DELAY);
    const response = await api.delete("posts/" + postId);
    return response.data;
  },
  async getPosts(filter: Filter): Promise<{posts: Post[], totalCount: number}> {
    await sleep(NETWORK_DELAY);
    const response = await api.get("posts" + buildQueryString(filter));
    return response.data;
  },
  async likePost(postId: number): Promise<{}> {
    await sleep(NETWORK_DELAY);
    const response = await api.post("likes" + buildQueryString({
      postId
    }));
    return response.data;
  },
  async unlikePost(postId: number): Promise<{}> {
    await sleep(NETWORK_DELAY);
    const response = await api.delete("likes" + buildQueryString({
      postId
    }));
    return response.data;
  },
}

export default postsAPI;