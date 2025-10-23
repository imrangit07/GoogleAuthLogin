import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get("http://localhost:3000/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        // window.location.href = "/";
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.name} ({user.email})</p>}
      <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>Logout</button>
    </div>
  );
}
