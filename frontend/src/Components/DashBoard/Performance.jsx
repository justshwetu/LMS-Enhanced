import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dstyle.css';
import { useNavigate } from 'react-router-dom';


const Performance = () => {
  const [performanceData, setPerfomanceData] = useState([]);
  const [enrolledcourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchCourse() {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          console.error("User ID not found in localStorage");
          setError("User not authenticated");
          return;
        }
        
        const response = await axios.get(`http://localhost:8080/api/learning/${userId}`);
        const fetchedCourse = response.data;
        
        // Ensure fetchedCourse is an array
        if (Array.isArray(fetchedCourse)) {
          setEnrolledCourses(fetchedCourse);
        } else {
          console.warn("Enrolled courses data is not an array:", fetchedCourse);
          setEnrolledCourses([]);
        }
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Failed to load enrolled courses");
        setEnrolledCourses([]);
      }
    }
    fetchCourse();
  }, []);

  useEffect(() => {
    async function fetchPerformanceData() {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          console.error("User ID not found in localStorage");
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        
        const response = await fetch(`http://localhost:8080/api/assessments/perfomance/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure data is an array and validate structure
        if (Array.isArray(data)) {
          const validatedData = data.filter(item => 
            item && 
            typeof item === 'object' && 
            item.course && 
            typeof item.course === 'object' &&
            item.course.course_name
          );
          setPerfomanceData(validatedData);
        } else {
          console.warn("Performance data is not an array:", data);
          setPerfomanceData([]);
        }
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError("Failed to load performance data");
        setPerfomanceData([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPerformanceData();
  }, [])

  function certifiedUser(id) {
    try {
      if (id) {
        navigate(`/certificate/${id}`);
      } else {
        console.error("Certificate ID is missing");
      }
    } catch (error) {
      console.error("Error navigating to certificate:", error);
    }
  }

  if (loading) {
    return (
      <div className="performance-container" style={{ marginTop: '70px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: 'darkblue' }}>Loading performance data...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-container" style={{ marginTop: '70px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: 'red' }}>Error: {error}</h3>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-container" style={{ marginTop: '70px' }}>
      <div style={{ marginBottom: '80px' }}>
        <h2 style={{ color: 'darkblue' }}>Courses Enrolled</h2>
        <table className="performance-table" style={{ width: '40%' }}>
          <thead>
            <tr>
              <th>Courses</th>
            </tr>
          </thead>
          <tbody>
            {enrolledcourses && enrolledcourses.length > 0 ? (
              enrolledcourses.map((data, index) => (
                <tr key={index}>
                  <td>{data?.course_name || "Course name not available"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ textAlign: 'center', fontStyle: 'italic' }}>No enrolled courses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <h2 style={{ color: 'darkblue' }}>PERFORMANCE</h2>
        <table className="performance-table" style={{ marginBottom: '40px' }}>
          <thead>
            <tr>
              <th>Courses</th>
              <th>Progress</th>
              <th>Marks</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {performanceData && performanceData.length > 0 ? (
              performanceData.map((data, index) => {
                const courseName = data?.course?.course_name || "Course name not available";
                const marks = data?.marks || 0;
                const courseId = data?.course?.id || data?.course?.course_id;
                
                return (
                  <tr key={index}>
                    <td>{courseName}</td>
                    <td className={marks !== 0 ? 'completed-status' : 'pending-status'}>
                      {marks !== 0 ? 'Completed' : 'Pending'}
                    </td>
                    <td>{marks}</td>
                    <td 
                      className={marks !== 0 ? 'completed-certificate' : 'pending-certificate'} 
                      onClick={() => courseId && marks !== 0 ? certifiedUser(courseId) : null}
                      style={{ cursor: courseId && marks !== 0 ? 'pointer' : 'default' }}
                    >
                      {marks !== 0 ? 'Download Certificate' : 'Not Available'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                  No performance data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Performance;
