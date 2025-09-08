import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ImgUpload from "./ImgUpload";
import Performance from "./DashBoard/Performance";



function Profile() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;



  useEffect(() => {
    if (!authToken) {
      console.warn("No authentication token found, redirecting to login");
      navigate("/login");
      return;
    }

    if (!id) {
      console.error("User ID not found in localStorage");
      setError("User authentication data is missing. Please log in again.");
      navigate("/login");
      return;
    }

    async function fetchUserDetails(attempt = 0) {
      try {
        setLoading(true);
        setError(null);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(
          `http://localhost:8080/api/users/${id}`,
          {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error("Authentication failed, redirecting to login");
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            navigate("/login");
            return;
          }
          throw new Error(`Failed to fetch user details. Status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate the received data structure
        if (!data || typeof data !== 'object') {
          throw new Error("Invalid user data received from server");
        }
        
        console.log("User details fetched successfully:", data);
        
        // Ensure learningCourses is an array
        const validatedData = {
          ...data,
          learningCourses: Array.isArray(data.learningCourses) ? data.learningCourses : []
        };
        
        setUserDetails(validatedData);
        setRetryCount(0); // Reset retry count on success
        
      } catch (error) {
        console.error(`Error fetching user details (attempt ${attempt + 1}):`, error);
        
        if (error.name === 'AbortError') {
          console.error("Request timed out");
          setError("Request timed out. Please check your internet connection.");
        } else if (attempt < MAX_RETRIES) {
          console.log(`Retrying... (${attempt + 1}/${MAX_RETRIES})`);
          setRetryCount(attempt + 1);
          setTimeout(() => fetchUserDetails(attempt + 1), 2000 * (attempt + 1)); // Exponential backoff
          return;
        } else {
          setError(`Failed to load user data: ${error.message}`);
        }
        
        // Set fallback user details to prevent null reference errors
        setUserDetails({
          username: "Unknown User",
          email: "Not available",
          phno: "Not available",
          gender: "Not specified",
          dob: "Not available",
          profession: "Not specified",
          learningCourses: []
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [authToken, navigate, id, MAX_RETRIES]);

  const handleImageChange = (event) => {
    try {
      const file = event?.target?.files?.[0];
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          console.error('Invalid file type. Please select an image file.');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          console.error('File size too large. Please select an image under 5MB.');
          return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const imageData = e.target.result;
            localStorage.setItem("profileImage", imageData);
            setProfileImage(imageData);
          } catch (error) {
            console.error('Error saving profile image:', error);
          }
        };

        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error handling image change:', error);
    }
  };


  // Loading state
  if (loading) {
    return (
      <div className="profile-page">
        <Navbar page={"profile"} />
        <div className="profile-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            flexDirection: 'column'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #00bcd4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <h3 style={{ color: '#00bcd4', marginBottom: '10px' }}>Loading Profile...</h3>
            {retryCount > 0 && (
              <p style={{ color: '#666', fontSize: '14px' }}>
                Retry attempt {retryCount}/{MAX_RETRIES}
              </p>
            )}
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error && !userDetails) {
    return (
      <div className="profile-page">
        <Navbar page={"profile"} />
        <div className="profile-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '40px'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px'
            }}>⚠️</div>
            <h3 style={{ color: '#f44336', marginBottom: '15px' }}>Error Loading Profile</h3>
            <p style={{ color: '#666', marginBottom: '20px', maxWidth: '400px' }}>
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '10px 20px',
                backgroundColor: '#00bcd4',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar page={"profile"} />
      {error && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '10px 15px',
          margin: '10px 20px',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          ⚠️ Warning: {error}
        </div>
      )}
      
      <div className="profile-container">
        {/* Profile Header Section */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <ImgUpload onChange={handleImageChange} src={profileImage} />
              <div className="avatar-glow"></div>
            </div>
            <div className="profile-title">
              <h1 className="profile-name">{userDetails?.username || "Loading..."}</h1>
              <p className="profile-subtitle">Learning Enthusiast</p>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{(userDetails?.learningCourses && Array.isArray(userDetails.learningCourses)) ? userDetails.learningCourses.length : 0}</span>
                  <span className="stat-label">Courses</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">🎓</span>
                  <span className="stat-label">Active Learner</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="profile-details-grid">
          <div className="detail-card">
            <div className="detail-icon">📧</div>
            <div className="detail-content">
              <h4>Email Address</h4>
              <p>{userDetails?.email || "Loading..."}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">📱</div>
            <div className="detail-content">
              <h4>Phone Number</h4>
              <p>{userDetails?.phno || "Loading..."}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">👤</div>
            <div className="detail-content">
              <h4>Gender</h4>
              <p>{userDetails?.gender || "Loading..."}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">🎂</div>
            <div className="detail-content">
              <h4>Date of Birth</h4>
              <p>{userDetails?.dob || "Loading..."}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">💼</div>
            <div className="detail-content">
              <h4>Profession</h4>
              <p>{userDetails?.profession || "Loading..."}</p>
            </div>
          </div>

          <div className="detail-card highlight-card">
            <div className="detail-icon">📚</div>
            <div className="detail-content">
              <h4>Learning Journey</h4>
              <p>{(userDetails?.learningCourses && Array.isArray(userDetails.learningCourses)) ? userDetails.learningCourses.length : 0} Active Courses</p>
              <div className="progress-indicator">
                <div className="progress-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Performance />
    </div>
  );
}

export default Profile;
