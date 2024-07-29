import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-green-900 h-screen w-1/5 p-4">
      <h2 className="text-lg text-white font-semibold mb-4">Strugbits</h2>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-md shadow-md">
        <p className="text-lg font-semibold mb-4">Are you sure you want to delete this record?</p>
        <div className="flex justify-end">
          <button className="mr-2 px-4 py-2 bg-gray-300 rounded-md" onClick={onCancel}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [inputUser, setInputUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [userData, setUserData] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleChange = (event) => {
    setInputUser({
      ...inputUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await axios.post("http://localhost:5000/createuser", inputUser);
    console.log(res);
    fetchAllUser();
    setShowForm(false);
  };

  const fetchAllUser = async () => {
    const res = await axios.get("http://localhost:5000/readalluser");
    console.log(res);
    setUserData(res.data);
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (deleteUserId) {
      const res = await axios.delete(`http://localhost:5000/delete/${deleteUserId}`);
      if (res.status === 200) {
        fetchAllUser();
        setShowDeleteConfirmation(false);
        setDeleteUserId(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteUserId(null);
  };

  const handleAddUserClick = () => {
    setShowForm(true);
  };

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-3/4 mx-auto mt-5">
        <div className="flex justify-left my-4">
          <button
            onClick={handleAddUserClick}
            className="px-4 py-2 text-white bg-green-900 rounded-full"
          >
            ADD CUSTOMER
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit}>
            <h1>Create User</h1>

            <div className="mb-4">
              <label className="block text-sm text-gray-500">Name</label>
              <input
                type="text"
                name="name"
                className="block w-full py-2.5 px-3 text-sm text-gray-900 bg-transparent border-2 border-gray-300"
                placeholder="Enter name"
                required
                value={inputUser.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-500">Email</label>
              <input
                type="text"
                name="email"
                className="block w-full py-2.5 px-3 text-sm text-gray-900 bg-transparent border-2 border-gray-300"
                placeholder="Enter email"
                required
                value={inputUser.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-500">Customer ID</label>
              <input
                type="number"
                name="password"
                className="block w-full py-2.5 px-3 text-sm text-gray-900 bg-transparent border-2 border-gray-300"
                placeholder="Customer ID"
                required
                value={inputUser.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-center my-4">
              <button type="submit" className="px-4 py-2 text-white bg-green-900 rounded-sm">
                Add User
              </button>
            </div>
          </form>
        )}

        <div className="relative overflow-x-auto shadow-md">
          <table className="w-full text-lg text-center text-gray-500">
            <thead className="text-[17px] text-white uppercase bg-green-900">
              <tr>
                <th scope="col" className="px-6 py-3">
                  SN.
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {userData.map((item, i) => (
                <tr
                  key={item._id}
                  className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {i + 1}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item?.name}
                  </th>
                  <td className="px-6 py-4"> {item?.email}</td>
                  <td className="px-6 py-4"> {item?.password}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-x-4 justify-center">
                      <NavLink
                        to={`/updateuser/${item._id}`}
                        className="font-medium text-green-400 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </NavLink>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="font-medium text-red-500  hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirmation}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Home;
