import { BANK_URL, SOCKET_URL, SERVER_URL } from "@/config/config";
import axios from "axios";

export const bankInstance = axios.create({
  baseURL: BANK_URL,
});

export const socketInstance = axios.create({
  baseURL: SOCKET_URL,
});

export const serverInstance = axios.create({
  baseURL: SERVER_URL,
});
