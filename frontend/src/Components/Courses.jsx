import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
 import { useNavigate } from "react-router-dom";
import axios from "axios";

import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Courses() {

  const [courses, setCourses] = useState([]);
  const userId = localStorage.getItem("id");
   const navigate = useNavigate();
   const[enrolled , SetEnrolled] = useState([]);
   const authToken = localStorage.getItem('token');

  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'course-image-fallback';
    fallbackDiv.style.cssText = `
      width: 100%;
      height: 200px;
      background-color: #404040;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #b0b0b0;
      font-size: 14px;
      border-radius: 8px 8px 0 0;
    `;
    fallbackDiv.textContent = 'Course Image';
    e.target.parentNode.insertBefore(fallbackDiv, e.target);
  };

  // Function to download course image
  const downloadImage = async (imageUrl, courseName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${courseName.replace(/\s+/g, '_')}_image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Image downloaded successfully!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };
  
  useEffect(() => {
    fetch("http://localhost:8080/api/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
      const userId = localStorage.getItem("id");
      if(userId){
        fetch(`http://localhost:8080/api/learning/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            let arr = [];
            for (let i=0;i<data.length ;i++){
              arr.push(data[i].course_id);
            }
            SetEnrolled(arr);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
        }
  }, []);

  function enrollCourse(courseId) {
    if(authToken){
      const enrollRequest = {
        userId: userId,
        courseId: courseId
     };
      axios.post('http://localhost:8080/api/learning', enrollRequest)
          .then((response) => {
            if(response.data == "Enrolled successfully"){
              toast.success('Course Enrolled successfully', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
              });
              setTimeout(()=>{
                navigate(`/course/${courseId}`);
              },2000);
            }
          })
          .catch((error) => {
              console.error('Enrollment error:', error);
          });
    }else{
      toast.error('You need to login to continue', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      setTimeout(()=>{
        navigate('/login');
      },2000);
    }
    
 }


return (
<div className="courses-page">
  <Navbar page={"courses"}/>
  
  {/* Fixed Header with Course Options */}
  <div className="courses-header-fixed">
    <div className="courses-header-content">
      <h2 className="courses-header-title">Course Dashboard</h2>
      <div className="courses-header-actions">
        <button 
          className="header-action-btn enroll-btn"
          onClick={() => {
            const coursesSection = document.querySelector('.courses-container');
            coursesSection.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          📚 Enroll in Courses
        </button>
        <button 
           className="header-action-btn view-btn"
           onClick={() => {
             if (enrolled.length === 0) {
               toast.info('No courses enrolled yet. Enroll in a course first!', {
                 position: 'top-right',
                 autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: false,
                 draggable: false,
               });
             } else {
               navigate("/learnings");
             }
           }}
         >
           👁️ {enrolled.length === 0 ? 'No Courses Enrolled' : `View My Courses (${enrolled.length})`}
         </button>
        <button 
          className="header-action-btn profile-btn"
          onClick={() => navigate("/profile")}
        >
          👤 My Profile
        </button>
      </div>
    </div>
  </div>
  
     <div className="courses-container">
      {enrolled.length === 0 && (
        <div className="no-enrollment-message">
          <div className="no-enrollment-content">
            <h3>🎓 Welcome to Your Learning Journey!</h3>
            <p>You haven't enrolled in any courses yet.</p>
            <p>Browse the courses below and start learning today!</p>
            <button 
              className="start-learning-btn"
              onClick={() => {
                const coursesSection = document.querySelector('.course-card');
                if (coursesSection) {
                  coursesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              🚀 Start Learning Now
            </button>
          </div>
        </div>
      )}
      {courses.map((course) => (
        <div key={course.course_id} className="course-card">
          <div className="course-image-container">
            <img 
              src={course.p_link} 
              alt={course.course_name} 
              className="course-image"
              onError={handleImageError}
              loading="lazy"
            />
            <button 
              className="download-image-btn"
              onClick={() => downloadImage(course.p_link, course.courseName)}
              title="Download course image"
            >
              ⬇️
            </button>
          </div>
            <div className="course-details">
              <h3 className="course-heading">
                {course.courseName.length < 8
                  ? `${course.courseName} Tutorial`
                  : course.courseName
                }
              </h3>
              <p className="course-description" style={{color:"grey"}}>Price: Rs.{course.price}</p>
              <p className="course-description">Tutorial by {course.instructor}</p>
            </div> 
          {enrolled.includes(course.course_id) ? (<button className="enroll-button" style={{color:'#F4D03F',backgroundColor:'darkblue',fontWeight:'bold'}} onClick={() => navigate("/learnings")}>
            Enrolled
          </button> ):(<button className="enroll-button" onClick={() => enrollCourse(course.course_id)}>
            Enroll
          </button> )}
        </div>
      ))}
     </div>
    </div>
  );
}

export default Courses;
