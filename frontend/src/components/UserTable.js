import React, { useEffect, useState } from "react";

const styles = {
  container: {
    marginLeft: "70px",
    padding: "30px",
    backgroundColor: "#edf2f7",
    minHeight: "100vh",
    fontFamily: "'Arial', sans-serif",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#333",
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#555",
  },
  searchInput: {
    padding: "12px",
    width: "300px",
    marginBottom: "30px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "#fff",
  },
  table: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
  },
  th: {
    padding: "14px 20px",
    backgroundColor: "#f2f6f9",
    fontWeight: "600",
    border: "1px solid #e2e8f0",
    textAlign: "left",
    color: "#333",
  },
  td: {
    padding: "14px 20px",
    border: "1px solid #e2e8f0",
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  updateButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  inputField: {
    padding: "12px",
    marginBottom: "15px",
    width: "250px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "#fff",
  },
  noUser: {
    textAlign: "center",
    padding: "20px",
    color: "#aaa",
  },
};

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

      if (res.ok) {
        fetchUsers();
      } else {
        console.error("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const updateUserDetails = async () => {
    if (!userDetails.userId) {
      console.log("No User ID found for update.");
      return;
    }

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
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome, {adminName}!</h1>
      <h2 style={styles.subtitle}>Manage Users</h2>

      {userDetails.userId && (
        <div style={{ marginBottom: "30px" }}>
          <h3>Update User Details</h3>
          <input
            type="text"
            placeholder="Name"
            value={userDetails.name}
            onChange={(e) =>
              setUserDetails({ ...userDetails, name: e.target.value })
            }
            style={styles.inputField}
          />
          <input
            type="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
            style={styles.inputField}
          />
          <input
            type="text"
            placeholder="Role"
            value={userDetails.role}
            onChange={(e) =>
              setUserDetails({ ...userDetails, role: e.target.value })
            }
            style={styles.inputField}
          />
          <button
            onClick={updateUserDetails}
            style={styles.updateButton}
            disabled={
              !userDetails.name || !userDetails.email || !userDetails.role
            }
          >
            Update User
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Search by email..."
        style={styles.searchInput}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noUser}>
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>
                  <button
                    onClick={() =>
                      setUserDetails({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        userId: user._id,
                      })
                    }
                    style={styles.updateButton}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
