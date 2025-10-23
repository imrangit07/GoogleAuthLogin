import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userParam = params.get("user");
    if (userParam) {
      // Parse user details
      const user = JSON.parse(decodeURIComponent(userParam));

      // Save token & user details in localStorage
      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      }));

      console.log("JWT Token:", user.token);
      console.log("User Info:", user);

    }
  }, [params, navigate]);

  return <h2>Login Success! Redirecting... ✅</h2>;
}

export default Success;
