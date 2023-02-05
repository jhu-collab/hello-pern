import { useState, useEffect, lazy } from "react";
import { Table, Loader, Notification, Paper } from "@mantine/core";
import { TbX } from "react-icons/tb";
import Loadable from "../../components/Loadable";
const NotAllowed = Loadable(lazy(() => import("../NotAllowed")));
import useQueryUsers from "../../hooks/useQueryUsers";
import Debug from "debug";

const debug = new Debug(`demo:pages:admin:Users.jsx`);

function Users() {
  const [rows, setRows] = useState([]);
  const { isLoading, error, data } = useQueryUsers();

  useEffect(() => {
    debug("Component mounted!");
  }, []);

  useEffect(() => {
    if (data) {
      setRows(
        data.map((element) => (
          <tr key={element.username}>
            <td>{element.username}</td>
            <td>{element.firstName}</td>
            <td>{element.lastName}</td>
            <td>{element.email}</td>
            <td>{element.role}</td>
          </tr>
        ))
      );
    }
  }, [data]);

  if (isLoading) return <Loader />;

  if (error) {
    return error.response?.status === 403 ? (
      <NotAllowed />
    ) : (
      <Notification icon={<TbX size={18} />} color="red">
        {"An error has occurred: " + error.message}
      </Notification>
    );
  }

  return (
    <Paper shadow="xs" radius="lg" p="xl">
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Username</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Paper>
  );
}

export default Users;
