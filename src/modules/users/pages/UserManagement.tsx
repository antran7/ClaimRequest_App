import { useState } from "react";
import "./UserManagement.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Locked";
}

const dummyUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Locked" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "User", status: "Active" },
  { id: 4, name: "Bob Brown", email: "bob@example.com", role: "User", status: "Active" },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "User", status: "Active" },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const lockUser = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: "Locked" } : user
    ));
  };

  const addUser = () => {
    const name = prompt("Enter name:");
    const email = prompt("Enter email:");
    const role = prompt("Enter role:");
    if (name && email && role) {
      setUsers([...users, { id: users.length + 1, name, email, role, status: "Active" }]);
    }
  };

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <button className="add-user-btn" onClick={addUser}>Add New User</button>
      <input
        type="text"
        placeholder="Search user..."
        className="search-bar"
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
                {user.role === "User" && user.status === "Active" && (
                  <button className="lock-btn" onClick={() => lockUser(user.id)}>Lock</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
