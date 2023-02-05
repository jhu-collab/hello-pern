import axios from "axios";
import { useQuery } from "react-query";
import { BASE_URL } from "./helper";
import Debug from "debug";

const debug = new Debug(`demo:hooks:useQueryBackend.js`);

function useQueryBackend() {
  const queryKey = ["backend"];

  const connectToBackend = async () => {
    try {
      const res = await axios.get(`${BASE_URL}`);
      return res.data;
    } catch (err) {
      debug({ err });
      throw err;
    }
  };

  return {
    ...useQuery(queryKey, connectToBackend),
  };
}

export default useQueryBackend;
