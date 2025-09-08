import React, {useState,useEffect} from 'react';
import './dstyle.css';
import SideBar from './SideBar';
import Navbar from './Navbar';
function Dashboard() {
  // const [dashboard , setDashboard] = useState(0);
  
  const [userscount , setUserscount] = useState(0);
  const [coursescount , setCoursescount] = useState(0);
  const[enrolled , setEnrolled] = useState(0);

  useEffect(()=>{
    fetch("http://localhost:8080/api/users").then((data)=>data.json()).then((res)=>setUserscount(res.length));
    fetch("http://localhost:8080/api/courses").then((data)=>data.json()).then((res)=>setCoursescount(res.length));
    fetch("http://localhost:8080/api/learning").then((data)=>data.json()).then((res)=>setEnrolled(res.length));
  },[])

  return (
    <div className="admin-dashboard" style={{backgroundColor:"#0f0f23", minHeight: "100vh", background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)"}}>
      <SideBar current={"dashboard"}/>
      <section id="content">
        <Navbar />
        <main>
          <div className="dashboard-header">
            <div className="header-content">
              <h1 className="dashboard-title">Admin Dashboard</h1>
              <p className="dashboard-subtitle">Welcome to your learning management control center</p>
            </div>
            <div className="header-decoration">
              <div className="floating-icon">⚡</div>
              <div className="floating-icon">📊</div>
              <div className="floating-icon">🎯</div>
            </div>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card users-card">
              <div className="stat-icon">
                <i className='bx bxs-group'></i>
                <div className="icon-glow"></div>
              </div>
              <div className="stat-content">
                <div className="stat-number" data-target="{userscount}">{userscount}</div>
                <div className="stat-label">Total Users</div>
                <div className="stat-trend">↗ +12% this month</div>
              </div>
              <div className="stat-chart">
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '80%'}}></div>
                <div className="chart-bar" style={{height: '100%'}}></div>
                <div className="chart-bar" style={{height: '75%'}}></div>
              </div>
            </div>

            <div className="stat-card courses-card">
              <div className="stat-icon">
                <i className='bx bx-book'></i>
                <div className="icon-glow"></div>
              </div>
              <div className="stat-content">
                <div className="stat-number" data-target="{coursescount}">{coursescount}</div>
                <div className="stat-label">Total Courses</div>
                <div className="stat-trend">↗ +8% this month</div>
              </div>
              <div className="stat-chart">
                <div className="chart-bar" style={{height: '70%'}}></div>
                <div className="chart-bar" style={{height: '90%'}}></div>
                <div className="chart-bar" style={{height: '85%'}}></div>
                <div className="chart-bar" style={{height: '100%'}}></div>
              </div>
            </div>

            <div className="stat-card enrollment-card">
              <div className="stat-icon">
                <i className='bx bxs-calendar-check'></i>
                <div className="icon-glow"></div>
              </div>
              <div className="stat-content">
                <div className="stat-number" data-target="{enrolled}">{enrolled}</div>
                <div className="stat-label">Total Enrollments</div>
                <div className="stat-trend">↗ +25% this month</div>
              </div>
              <div className="stat-chart">
                <div className="chart-bar" style={{height: '50%'}}></div>
                <div className="chart-bar" style={{height: '75%'}}></div>
                <div className="chart-bar" style={{height: '90%'}}></div>
                <div className="chart-bar" style={{height: '100%'}}></div>
              </div>
            </div>

            <div className="stat-card performance-card">
              <div className="stat-icon">
                <i className='bx bx-trending-up'></i>
                <div className="icon-glow"></div>
              </div>
              <div className="stat-content">
                <div className="stat-number">98%</div>
                <div className="stat-label">Success Rate</div>
                <div className="stat-trend">↗ +5% this month</div>
              </div>
              <div className="stat-chart">
                <div className="chart-bar" style={{height: '85%'}}></div>
                <div className="chart-bar" style={{height: '92%'}}></div>
                <div className="chart-bar" style={{height: '88%'}}></div>
                <div className="chart-bar" style={{height: '98%'}}></div>
              </div>
            </div>
          </div>

          <div className="dashboard-insights">
            <div className="insight-card">
              <h3>📈 Growth Analytics</h3>
              <p>Your platform is experiencing steady growth with increased user engagement.</p>
              <div className="insight-progress">
                <div className="progress-bar" style={{width: '85%'}}></div>
              </div>
            </div>
            
            <div className="insight-card">
              <h3>🎯 Performance Metrics</h3>
              <p>Course completion rates are above average with excellent user satisfaction.</p>
              <div className="insight-progress">
                <div className="progress-bar" style={{width: '92%'}}></div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Dashboard;
