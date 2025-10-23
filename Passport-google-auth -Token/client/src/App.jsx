// App.jsx
import React from 'react';

function App() {
  const handleGoogleLogin = () => {
    window.open("http://localhost:3000/auth/google", "_self");
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Google Login Example</h1>
      <button 
        onClick={handleGoogleLogin}
        style={{
          background: '#4285F4',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default App;
