import React, { useEffect, useState } from 'react';
import './UserTable.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar/Sidebar'; // Import the Sidebar component

const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/user/all');
        const data = await response.json();
        if (data.success) {
          setUsers(data.users); // Update the state with the fetched users
        } else {
          console.error('Error fetching users:', data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/user/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(user => user._id !== userId)); // Remove the deleted user from the state
        toast.success('User deleted successfully!');
      } else {
        console.error('Error deleting user:', data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDelete = (userId) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteUser(userId),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  return (
    <div className="user-table-container">
      <Sidebar /> {/* Include the sidebar */}
      <div className="user-table-content"> {/* Wrapper for table content */}
        <h1>User List</h1> {/* Add a heading for user list */}
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleDelete(user._id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserTable;
