const apiConfig = {
  baseUrl: "https://api.themoviedb.org/3/",
  apiKey: process.env.REACT_APP_TMDB_API_KEY,
  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

// Validate API key exists
if (!apiConfig.apiKey) {
  console.error("⚠️ TMDB API Key is missing! Please add REACT_APP_TMDB_API_KEY to your .env file");
  console.error("Get your free API key at: https://www.themoviedb.org/settings/api");
}

export default apiConfig;
