import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3000/auth/login", { email, password });
      localStorage.setItem("token", data.token);
        navigate("/dashboard");
    
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleGoogle = () => {
    window.open("http://localhost:3000/auth/google", "_self");
  };

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGoogle}>Login with Google</button>
    </div>
  );
}
