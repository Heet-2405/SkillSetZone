import React, { useEffect, useState } from "react";
import "/src/css/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const authToken = localStorage.getItem("auth");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/profile", {
        method: "GET",
        headers: { Authorization: `Basic ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");

      const data = await response.json();
      const imageSrc = data.image ? `data:image/jpeg;base64,${data.image}` : null;

      setUser({ ...data, imageSrc });
      setFormData({
        name: data.name,
        email: data.email,
        password: "",
        branch: data.collegeBranch || "",
        image: null,
      });
      setPreviewImage(imageSrc);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file });
    }
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("branch", formData.branch);
    if (formData.password) formDataToSend.append("password", formData.password);
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:8080/api/users/updateUser", {
        method: "POST",
        headers: { Authorization: `Basic ${authToken}` },
        body: formDataToSend,
      });
      if (!response.ok) throw new Error("Failed to update profile");

      alert("Profile updated successfully!");
      setEditMode(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="profile-page">
    <div className="profile-container">
      <h2>User Profile</h2>
      {user ? (
        <div>
          <img
            src={previewImage}
            alt="Profile"
            className="profile-image"
          />
          {editMode ? (
            <div className="edit-form">
              <label>Profile Image:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />

              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />

              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />

              <label>Password (Leave blank to keep unchanged):</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />

              <label>Branch:</label>
              <select name="branch" value={formData.branch} onChange={handleChange}>
              <option value="">Select College Branch</option>
          <option value="CSE">Computer Science</option>
          <option value="IT">Information Technology</option>
          <option value="ECE">Electronics & Communication</option>
          <option value="EE">Electrical Engineering</option>
          <option value="ME">Mechanical Engineering</option>
              </select>

              <div className="button-group">
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Branch:</strong> {user.collegeBranch}</p>
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
    </div>
  );
}

export default Profile;




