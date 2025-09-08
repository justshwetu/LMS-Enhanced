import React, { useEffect  , useState} from 'react';
import './dstyle.css'; // Import your CSS styles
import SideBar from './SideBar';
import Navbar from './Navbar';
function Users() {
  const [users , setUsers] = useState([]);
  useEffect(()=>{
    fetch("http://localhost:8080/api/users").then((data)=>data.json()).then((res)=>setUsers(res));
  },[])
  console.log(users);
  return (
    <div style={{backgroundColor:"#0f0f23", minHeight: "100vh", background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)"}}>
      <SideBar current={"user"}/>
      <section id="content">
        <Navbar />
        <main>
          <div className="table-data" style={{marginTop:"-10px"}}>
            <div className="order">
              <div className="head">
                <h3 style={{color: "#ffffff", textShadow: "0 0 20px rgba(0, 212, 255, 0.5)"}}>Users Info</h3>
              </div>
              <table id="user" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'start', borderBottom: '1px solid #ddd' }}>Username</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Phone Number</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Profession</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px', textAlign: 'start', borderBottom: '1px solid #ddd' }}>{user.username}</td>
                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{user.email}</td>
                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{user.phno}</td>
                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{user.profession}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Users;
