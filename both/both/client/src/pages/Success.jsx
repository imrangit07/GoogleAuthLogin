import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Success() {
  const [params] = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    }
  }, [token]);

  return <h2>Logging you in...</h2>;
}
