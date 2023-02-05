import axios from "axios";
import { useQuery } from "react-query";
import { BASE_URL, getMessage } from "./helper";
import useStoreToken from "./useStoreToken";
import { showNotification } from "@mantine/notifications";
import { TbX } from "react-icons/tb";
import Debug from "debug";

const debug = new Debug(`demo:hooks:useQueryUsers.js`);

function useQueryUsers() {
  const queryKey = ["users"];
  const { token, updateToken } = useStoreToken();

  const getUsers = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const endpoint = `${BASE_URL}/api/users`;
      const res = await axios.get(endpoint, { headers });
      const { message, data, token: newToken } = res.data;
      debug({ message, data });
      updateToken(newToken);
      return data;
    } catch (err) {
      debug({ err });
      showNotification({
        title: "Oh no!",
        message: getMessage(err),
        color: "red",
        icon: <TbX />,
      });
      throw err;
    }
  };

  return {
    ...useQuery(queryKey, getUsers),
  };
}

export default useQueryUsers;
