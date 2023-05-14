import axios from "axios";

const baseURL = process.env.REACT_APP_API;

const token = localStorage.getItem("token");

const $api = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

$api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      const refresh = localStorage.getItem("token");
      if (refresh) {
        localStorage.setItem("token", refresh);
        localStorage.removeItem("refresh");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
      }
    }
    return Promise.reject(error);
  }
);

export { $api, baseURL };
