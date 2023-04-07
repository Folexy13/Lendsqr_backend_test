import axios from "axios";

/**
 * 
 * const getStoredToken = require("../utils/getStoretoken");
const axios = require("axios");
require("dotenv").config();

const baseurl = "https://serviceaccount1.meritgraph.com";
// const tokenResult = await getStoredToken()
// const MHToken = tokenResult[0].token
const MHToken = "";

const CLIENT_ID = process.env.MERITHUB_CLIENT_ID;

const api = axios.create({
  baseURL: `https://serviceaccount1.meritgraph.com/v1/${CLIENT_ID}`,
});

api.interceptors.request.use(
  async (request) => {
    request.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getStoredToken()}`,
    };
    return request;
  },
  (error) => {
    console.log("App can't make a request");
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("response received");
    if (response?.data?.token) {
      // console.log(getStoredAuthToken());
      console.log(response.data);
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

module.exports = api;
 */