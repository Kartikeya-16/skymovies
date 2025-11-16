const apiConfig = {
  baseUrl: "https://api.themoviedb.org/3/",
  apiKey: process.env.REACT_APP_TMDB_API_KEY || "086cfe05dd16828e37291d2f37293a38",
  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

// Log API key status for debugging (only first/last 4 chars for security)
if (apiConfig.apiKey) {
  const keyPreview = apiConfig.apiKey.length > 8 
    ? `${apiConfig.apiKey.substring(0, 4)}...${apiConfig.apiKey.substring(apiConfig.apiKey.length - 4)}`
    : "****";
  console.log(`TMDB API Key loaded: ${keyPreview} (length: ${apiConfig.apiKey.length})`);
} else {
  console.error("⚠️ TMDB API Key is missing! Please add REACT_APP_TMDB_API_KEY to your .env file");
  console.error("Get your free API key at: https://www.themoviedb.org/settings/api");
}

export default apiConfig;
