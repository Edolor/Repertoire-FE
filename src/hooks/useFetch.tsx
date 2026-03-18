import axios from "axios";
import { baseURL } from "@/urls";

function useFetch() {
  const fetchData = async (url: string) => {
    if (!url.startsWith(baseURL)) {
      throw new Error("Blocked request to disallowed URL");
    }
    return await axios.get(url);
  };

  return { fetchData };
}

export default useFetch;
