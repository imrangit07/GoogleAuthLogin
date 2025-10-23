// Success.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Success() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/user", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <img src={user.picture} alt="profile" width="100" style={{ borderRadius: '50%' }} />
          <p>{user.email}</p>
          <button onClick={() => window.open("http://localhost:3000/auth/logout", "_self")}>
            Logout
          </button>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}

export default Success;
