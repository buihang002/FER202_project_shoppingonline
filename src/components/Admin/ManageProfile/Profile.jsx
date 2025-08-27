import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ManageProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    avatarURL: "",
  });

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:9999/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          username: data.username || "",
          fullname: data.fullname || "",
          email: data.email || "",
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, avatarURL: reader.result });
      reader.readAsDataURL(file);
    }
  };

 const handleSave = () => {
  fetch(`http://localhost:9999/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...user,
      ...form,
      updatedAt: new Date().toISOString(),
    }),
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
        <div className="text-center">
          <img
            src={form.avatarURL || "/default-avatar.png"}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-2"
            />
          )}
        </div>

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
          <label className="font-semibold">Role:</label>
          <p>{user.role}</p>
        </div>

        {editMode ? (
          <div className="flex gap-2 mt-2">
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
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ManageProfile;
