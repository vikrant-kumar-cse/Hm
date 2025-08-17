import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Form,
  FormGroup,
  Label,
} from "reactstrap";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    role: "",
    userId: "",
  });
  const [adminName, setAdminName] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setAdminName(data.name || "Admin");
    } catch (err) {
      console.error("Error fetching admin profile:", err);
      setAdminName("Admin");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8080/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) fetchUsers();
      else console.error("Failed to delete user");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const updateUserDetails = async () => {
    if (!userDetails.userId) return;

    const { name, email, role, userId } = userDetails;
    try {
      const res = await fetch(`http://localhost:8080/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, email, role }),
      });

      if (res.ok) {
        fetchUsers();
        setUserDetails({ name: "", email: "", role: "", userId: "" });
      } else {
        console.error("Failed to update user details");
      }
    } catch (err) {
      console.error("Error updating user details:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className="py-4">
      <Card className="mb-4 shadow-sm">
        <CardBody>
          <CardTitle tag="h2">Welcome, {adminName}!</CardTitle>
          <CardSubtitle className="text-muted mb-3">
            Manage Users
          </CardSubtitle>
        </CardBody>
      </Card>

      {userDetails.userId && (
        <Card className="mb-4 shadow-sm">
          <CardBody>
            <CardTitle tag="h4">Update User Details</CardTitle>
            <Form>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>Role</Label>
                <Input
                  type="text"
                  value={userDetails.role}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, role: e.target.value })
                  }
                />
              </FormGroup>
              <Button
                color="primary"
                onClick={updateUserDetails}
                disabled={
                  !userDetails.name || !userDetails.email || !userDetails.role
                }
              >
                Update User
              </Button>
            </Form>
          </CardBody>
        </Card>
      )}

      <Input
        type="text"
        placeholder="Search by email..."
        className="mb-3"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th width="200px">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    color="info"
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      setUserDetails({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        userId: user._id,
                      })
                    }
                  >
                    Update
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminUsersPage;
