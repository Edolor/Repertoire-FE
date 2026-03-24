import axios from "axios";
import { baseURL } from "@/urls";

export const apiClient = axios.create({ baseURL });
