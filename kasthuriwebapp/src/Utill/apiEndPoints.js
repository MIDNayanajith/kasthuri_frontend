export const BASE_URL = "http://localhost:8080/api/v1.0/";
const CLOUDINARY_CLOUD_NAME = "dmogz38bw";

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  GET_ALL_USERS: "/users",
  UPDATE_USER: (id) => `/users/${id}`,
  DELETE_USER: (id) => `/users/${id}`,

  // Driver endpoints
  GET_ALL_DRIVERS: "/drivers",
  ADD_DRIVER: "/drivers",
  UPDATE_DRIVER: (id) => `/drivers/${id}`,
  DELETE_DRIVER: (id) => `/drivers/${id}`,

  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
};
