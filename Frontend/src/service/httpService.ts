/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/ApiService.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://sili.ppvserver.com/";

// Helper function to convert JSON to URL encoded data
const JSON_to_URLEncoded = (element: any, key?: any, list?: any): string[] => {
  let newList = list || [];
  if (typeof element === "object") {
    for (let idx in element) {
      JSON_to_URLEncoded(element[idx], key ? `${key}[${idx}]` : idx, newList);
    }
  } else {
    newList.push(`${key}=${encodeURIComponent(element)}`);
  }
  return newList;
};

const ApiService = {
  // Upload file method
  uploadFile: async (files: File[]): Promise<AxiosResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("userfile", file));
    return axios.post(`${API_URL}/users/upload_image`, formData);
  },

  // Post request with private authorization (JWT token)
  postPrivate: async (url: string, body: any): Promise<any> => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    };
    const params = JSON_to_URLEncoded(body);
    try {
      const response = await axios.post(`${API_URL}${url}`, params.join("&"), {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Post request with temporary authorization
  postTemp: async (url: string, body: any, tempToken: string): Promise<any> => {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${tempToken}`,
    };
    const params = JSON_to_URLEncoded(body);
    try {
      const response = await axios.post(`${API_URL}${url}`, params.join("&"), {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Public POST request (no authentication required)
  postPublic: async (url: string, body: any): Promise<any> => {
    try {
      console.log(`${API_URL}${url}`, body, "post link");

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(`${API_URL}${url}`, body);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Public GET request (no authentication required)
  getPublic: async (url: string): Promise<any> => {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    try {
      console.log(`${API_URL}${url}`, "get link");

      const response = await axios.get(`${API_URL}${url}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload image method (for images with extensions)
  uploadImage: async (
    url: string,
    blobData: Blob,
    ext: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("image", blobData, `image.${ext}`);
    try {
      const response = await axios.post(`${API_URL}${url}`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Private GET request (authentication required)
  getPrivate: async (url: string): Promise<any> => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.get(`${API_URL}${url}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // External GET request (no authentication required, external API)
  externalGet: async (url: string): Promise<any> => {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fetch local JSON assets (like static JSON files)
  getLocalAssets: async (name: string): Promise<any> => {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    try {
      const response = await axios.get(`assets/json/${name}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ApiService;
