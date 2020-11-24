import api from "./config";

export default {
  async register(login: string, password: string) {
    const response = await api.post("users/register", {login, password});
    return response.data;
  },
  async login(login: string, password: string) {
    const response = await api.post("users/login", {login, password});
    return response.data;
  },
  async logout() {
    const response = await api.delete(`users/login`);
    return response.data;
  }
}