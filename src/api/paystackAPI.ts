import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import { gray } from "colorette";
import { PAYSTACK_BASE_URL, PAYSTACK_SECRET_KEY } from "../config";

dotenv.config();

export class PaystackApi {
  private api = axios.create({
    baseURL: PAYSTACK_BASE_URL,
  });

  constructor() {
    this.api.interceptors.request.use(
      async (request: any) => {
        request.headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'cache-control': 'no-cache'
        };
        return request;
      },
      (error) => {
        console.log("App can't make a request");
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(gray("response received"));
        return response.data;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async post(url: string, data: any): Promise<any> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async get(url: string, params?: any): Promise<any> {
    const response = await this.api.get(url, { params });
    return response.data;
  }
}
