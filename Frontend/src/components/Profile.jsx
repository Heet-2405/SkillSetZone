import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const authToken = localStorage.getItem("auth");

  const fetchUserProfile = async () => {
    const headers = { Authorization: `Basic ${authToken}` };
    try {
      const response = await fetch("http://localhost:8080/api/users/profile", {
        method: "GET",
        headers,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Branch:</strong> {user.collegeBranch}</p>
          <p><strong>Password:</strong> {user.password}</p>
          {/* Add more user details as needed */}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;
