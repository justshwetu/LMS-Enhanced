import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./css/validation.css";

function RegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Name is required";
    } else if (formData.username.length < 2) {
      errors.username = "Name must be at least 2 characters long";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (!formData.phno.trim()) {
      errors.phno = "Phone number is required";
    } else if (!validatePhone(formData.phno)) {
      errors.phno = "Please enter a valid 10-digit phone number";
    }
    
    // Password validation
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 6 characters long";
    }
    
    // Date of birth validation
    if (formData.dob && formData.dob.trim()) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate >= today) {
        errors.dob = "Date of birth must be in the past";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setValidationErrors({}); // Clear validation errors
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful!");
        navigate("/login");
      } else {
        // Try to get error message from response
        let errorMessage = "Registration failed. Please try again.";
        try {
          const data = await response.json();
          if (data.errors) {
            // Handle validation errors from backend
            setValidationErrors(data.errors);
            errorMessage = data.message || "Please fix the validation errors";
          } else {
            errorMessage = data.error || data.message || errorMessage;
          }
        } catch (parseError) {
          // If response is not JSON, use default message
          console.log("Could not parse error response");
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
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
                  className={validationErrors.username ? 'error' : ''}
                  required
                />
                {validationErrors.username && (
                  <span className="validation-error">{validationErrors.username}</span>
                )}
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
                  className={validationErrors.email ? 'error' : ''}
                  required
                />
                {validationErrors.email && (
                  <span className="validation-error">{validationErrors.email}</span>
                )}
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
                  className={validationErrors.phno ? 'error' : ''}
                  placeholder="1234567890"
                  required
                />
                {validationErrors.phno && (
                  <span className="validation-error">{validationErrors.phno}</span>
                )}
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
                  className={validationErrors.password ? 'error' : ''}
                  required
                />
                {validationErrors.password && (
                  <span className="validation-error">{validationErrors.password}</span>
                )}
              </div>
            </div>
            <div className="registration-input-group">
              <div>
                <div className="registration-text-area">
                  <label>Date of Birth:</label>
                </div>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={validationErrors.dob ? 'error' : ''}
                />
                {validationErrors.dob && (
                  <span className="validation-error">{validationErrors.dob}</span>
                )}
              </div>
              <div>
                <div className="registration-text-area">
                  <label>Gender:</label>
                </div>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={validationErrors.gender ? 'error' : ''}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
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
                  placeholder="City, Country"
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
                  placeholder="Your profession"
                />
              </div>
            </div>

            {error && <span className="registration-error-msg">{error}</span>}
            <div className="registration-btn1">
              <button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
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
