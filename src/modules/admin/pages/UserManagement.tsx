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
  { id: 1, name: "Robin Kool", email: "robinkool@gmail.com", role: "Admin", status: "Active" },
  { id: 2, name: "Henry Cavill", email: "henrycavill@gmail.com", role: "User", status: "Locked" },
  { id: 3, name: "Ryan Gosling", email: "ryangosling@gmail.com", role: "User", status: "Active" },
  { id: 4, name: "Harry Potter", email: "harrypotter@gmail.com", role: "User", status: "Active" },
  { id: 5, name: "LeBron James", email: "lebronjames@gmail.com", role: "User", status: "Active" },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleLockUser = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: user.status === "Active" ? "Locked" : "Active" } : user
    ));
  };

  const editUser = (id: number) => {
    const userToEdit = users.find(user => user.id === id);
    if (!userToEdit) return;

    const newName = prompt("Enter new name:", userToEdit.name);
    const newEmail = prompt("Enter new email:", userToEdit.email);
    const newRole = prompt("Enter new role:", userToEdit.role);

    if (newName && newEmail && newRole) {
      setUsers(users.map(user => 
        user.id === id ? { ...user, name: newName, email: newEmail, role: newRole } : user
      ));
    }
  };

  const deleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
    }
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
                <button className="edit-btn" onClick={() => editUser(user.id)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
                <button className="lock-btn" onClick={() => toggleLockUser(user.id)}>
                  {user.status === "Active" ? "Lock" : "Unlock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}