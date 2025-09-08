import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function RegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phno: "",
    password: "",
    dob: "",
    gender: "",
    location: "",
    profession: "",

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:8080/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) { // This checks for status 200-299
        console.log("Registration successful!");
        navigate("/login");
      } else {
        // Try to get error message from response
        let errorMessage = "Registration failed. Please try again.";
        try {
          const data = await response.json();
          errorMessage = data.error || data.message || errorMessage;
        } catch (parseError) {
          // If response is not JSON, use default message
          console.log("Could not parse error response");
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="registration-auth">
        <div className="registration-container">
          <h2>User Registration</h2>
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="registration-input-group">
              <div>
                <div className="registration-text-area">
                  <label>Name: </label>
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="registration-text-area">
                  <label>Email Id:</label>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="registration-input-group">
              <div>
                <div className="registration-text-area">
                  <label>Phone no:</label>
                </div>
                <input
                  type="tel"
                  name="phno"
                  value={formData.phno}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="registration-text-area">
                  <label>Password:</label>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="registration-input-group">
              <div>
                <div className="registration-text-area">
                  <label>Date of Birth:</label>
                </div>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="registration-text-area">
                  <label>Gender:</label>
                </div>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="registration-input-group">
              <div>
                <div className="registration-text-area">
                  <label>Location:</label>
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="registration-text-area">
                  <label>Profession:</label>
                </div>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <span className="registration-error-msg">{error}</span>}
            <div className="registration-btn1">
              <button type="submit">Register</button>
            </div>
          </form>
          <span>
            Already have an account? login
            <Link to="/login"> Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
