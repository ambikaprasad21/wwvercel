import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Signup.module.css";
import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import styled from "styled-components";
import toast from "react-hot-toast";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OutlinedBox = styled.div`
  border-radius: 12px;
  border: 1px solid gray;
  margin-top: 5rem;
  font-size: 14px;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 1rem 1rem;
  background-color: white;
  color: black;
`;

const GoogleIcon = styled.img`
  width: 22px;
`;

const Divider = styled.div`
  display: flex;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
`;
const Line = styled.div`
  width: 80px;
  height: 1px;
  border-radius: 10px;
  margin: 0px 10px;
  background-color: #ccc;
`;

export default function Signup() {
  // PRE-FILL FOR DEV PURPOSES
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();

  const { dispatch, signup, isAuthenticated, googleSignIn } = useAuth();

  function handleSignup(e) {
    e.preventDefault();
    if (username && email && password) signup(username, email, password);
  }

  useEffect(
    function () {
      if (isAuthenticated) {
        navigate("/app", { replace: true });
        //using the replace as true we are manupulating the history stack
      }
    },
    [isAuthenticated]
  );

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const user = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .catch((err) => {
          console.log(err);
        });

      console.log(user.data);
      const res = await googleSignIn(
        user.data.name,
        user.data.email,
        user.data.picture
      );
      // console.log(res);

      if (res.status === 200) {
        const data = await res.json();
        // console.log(data.token);
        toast.success("sign up success");
        localStorage.setItem("worldwiseid", data.token);
        dispatch({ type: "login", payload: data.data });
        setLoading(false);
      } else {
        navigate("/");
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      toast.error(errorResponse);
      console.log(errorResponse);
      setLoading(false);
    },
  });

  return (
    <main className={styles.login}>
      <PageNav />
      <Container>
        <div>
          <OutlinedBox onClick={() => googleLogin()}>
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <>
                <GoogleIcon src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRB4kg1jgnqD5fEaCSHKMoUdFeTBj9CH_opA&s" />
                Sign In with Google
              </>
            )}
          </OutlinedBox>
          <Divider>
            <Line />
            or
            <Line />
          </Divider>
        </div>
        <form className={styles.form} onSubmit={handleSignup}>
          <div className={styles.row}>
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              id="name"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div>
            <Button type="primary">Signup</Button>
          </div>
        </form>
      </Container>
    </main>
  );
}
