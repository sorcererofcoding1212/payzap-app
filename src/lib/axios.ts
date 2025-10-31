import { BANK_URL, SOCKET_URL } from "@/config/config";
import axios from "axios";

export const bankInstance = axios.create({
  baseURL: BANK_URL,
});

export const socketInstance = axios.create({
  baseURL: SOCKET_URL,
});
