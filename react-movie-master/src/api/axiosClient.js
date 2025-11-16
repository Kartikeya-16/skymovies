import axios from "axios";
import queryString from "query-string";

import apiConfig from "./apiConfig";

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) =>
    queryString.stringify({ ...params, api_key: apiConfig.apiKey }),
});

axiosClient.interceptors.request.use(async (config) => config);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    // Enhanced error logging for debugging
    if (error.response?.status === 401) {
      console.error("❌ TMDB API Authentication Error (401)");
      console.error("Your API key is invalid or missing.");
      console.error("Steps to fix:");
      console.error("1. Go to https://www.themoviedb.org/settings/api");
      console.error("2. Copy your API key (v3 auth)");
      console.error("3. Add it to .env file as: REACT_APP_TMDB_API_KEY=your_key_here");
      console.error("4. Restart your development server");
      console.error(`Failed URL: ${error.config?.url}`);
    }
    throw error;
  }
);

export default axiosClient;
