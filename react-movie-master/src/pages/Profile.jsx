import React, { useState } from "react";
import PageHeader from "../components/page-header/PageHeader";
import "./profile.scss";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    dateOfBirth: "1990-01-15",
    gender: "male",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Save profile logic will be added later
    setIsEditing(false);
    console.log("Profile saved:", formData);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Password change logic will be added later
    console.log("Password changed");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      <PageHeader>My Profile</PageHeader>

      <div className="container">
        <div className="profile-page">
          <div className="profile-container">
            <div className="profile-sidebar">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  <i className="bx bx-user"></i>
                </div>
                <button className="change-avatar-btn">
                  <i className="bx bx-camera"></i>
                  Change Photo
                </button>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <h3>24</h3>
                  <p>Movies Watched</p>
                </div>
                <div className="stat-item">
                  <h3>12</h3>
                  <p>Bookings</p>
                </div>
                <div className="stat-item">
                  <h3>8</h3>
                  <p>Watchlist</p>
                </div>
              </div>
            </div>

            <div className="profile-content">
              <div className="profile-section">
                <div className="section-header">
                  <h2>Personal Information</h2>
                  <button
                    className="edit-btn"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <i className={`bx ${isEditing ? "bx-x" : "bx-edit"}`}></i>
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {isEditing && (
                    <button type="submit" className="save-btn">
                      <i className="bx bx-save"></i>
                      Save Changes
                    </button>
                  )}
                </form>
              </div>

              <div className="profile-section">
                <div className="section-header">
                  <h2>Change Password</h2>
                </div>

                <form onSubmit={handleChangePassword} className="profile-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button type="submit" className="save-btn">
                    <i className="bx bx-key"></i>
                    Update Password
                  </button>
                </form>
              </div>

              <div className="profile-section danger-zone">
                <div className="section-header">
                  <h2>Account Actions</h2>
                </div>
                <button className="logout-btn">
                  <i className="bx bx-log-out"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

