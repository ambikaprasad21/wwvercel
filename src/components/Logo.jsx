import { Link, useNavigate } from "react-router-dom";
import styles from "./Logo.module.css";
import { useEffect } from "react";
// import { API } from "../../constants";
const API = import.meta.env.VITE_API;
import { useAuth } from "../contexts/AuthContext";

function Logo() {
  let { dispatch } = useAuth();
  // const navigate = useNavigate();
  useEffect(() => {
    // const lastVisitedUrl = localStorage.getItem("lastVisitedUrl");
    const getProfile = async () => {
      const res = await fetch(`${API}/api/v1/auth/profile`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("worldwiseid")}`,
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        dispatch({ type: "login", payload: data.data });
      }
    };

    getProfile();
  }, []);
  return (
    <Link to="/">
      <img src="/logo.png" alt="WorldWise logo" className={styles.logo} />
    </Link>
  );
}

export default Logo;
