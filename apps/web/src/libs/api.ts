import axios from "axios";

export const getGeospatialAxiosInstance = () => {
  return axios.create({
    baseURL: process.env.GEOSPATIAL_API_URL,
    headers: {
      "x-api-key": process.env.GEOSPATIAL_API_KEY,
    },
  });
};
