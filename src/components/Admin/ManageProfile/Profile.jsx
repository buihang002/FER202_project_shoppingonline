import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:8080/intern/profile"; // endpoint backend

const ManageProfile = () => {
  const { userId } = useParams(); // lấy userId từ URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    avatarURL: "",
  });

  // Lấy thông tin user từ API
  useEffect(() => {
    fetch(`${API_URL}/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          fullname: data.fullname || "",
          email: data.email || "",
          username: data.username || "",
          avatarURL: data.avatarURL || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch(`${API_URL}/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setEditMode(false);
        alert("Profile updated successfully!");
      })
      .catch((err) => console.error(err));
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Profile</h2>
      <div className="flex flex-col gap-4">
        <img
          src={form.avatarURL || "/default-avatar.png"}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover mx-auto"
        />
        <div>
          <label className="font-semibold">Full Name:</label>
          {editMode ? (
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-1"
            />
          ) : (
            <p>{user.fullname}</p>
          )}
        </div>
        <div>
          <label className="font-semibold">Username:</label>
          {editMode ? (
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-1"
            />
          ) : (
            <p>{user.username}</p>
          )}
        </div>
        <div>
          <label className="font-semibold">Email:</label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-1"
            />
          ) : (
            <p>{user.email}</p>
          )}
        </div>
        <div>
          <label className="font-semibold">Avatar URL:</label>
          {editMode ? (
            <input
              type="text"
              name="avatarURL"
              value={form.avatarURL}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-1"
            />
          ) : (
            <p>{user.avatarURL}</p>
          )}
        </div>

        {editMode ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ManageProfile;
