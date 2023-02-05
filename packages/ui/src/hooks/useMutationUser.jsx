import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { BASE_URL, getMessage } from "./helper";
import useStoreToken from "./useStoreToken";
import { showNotification } from "@mantine/notifications";
import { TbX } from "react-icons/tb";
import Debug from "debug";

const debug = new Debug(`demo:hooks:useMutationUser.js`);

function useMutationUser() {
  const { token, updateToken } = useStoreToken();
  const queryClient = useQueryClient();

  const updateUser = async (user) => {
    try {
      debug("Updating", user);
      const { id, ...rest } = user;
      const headers = { Authorization: `Bearer ${token}` };
      const endpoint = `${BASE_URL}/api/users/${id}`;
      const res = await axios.put(endpoint, { ...rest }, { headers });
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

  const mutation = useMutation(
    (user) => {
      debug("mutation function");
      debug(user);
      return updateUser(user);
    },
    {
      onSuccess: (user) => {
        debug("mutation success");
        queryClient.setQueryData(["user"], (old) => {
          debug({ oldUserInfo: old });
          return user;
        });
      },
    }
  );

  return {
    userMutation: mutation,
  };
}

export default useMutationUser;
