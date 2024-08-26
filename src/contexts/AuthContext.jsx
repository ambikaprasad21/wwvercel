import { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";
// import { API } from "../../constants";
const API = import.meta.env.VITE_API;

console.log(API);
const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };

    case "logout":
      return { ...state, user: null, isAuthenticated: false };

    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function signup(username, email, password) {
    try {
      const res = await fetch(`${API}/api/v1/auth/signup`, {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (res.status !== 200) {
        const data = await res.json();
        toast.error(data.message);
      } else {
        const data = await res.json();
        localStorage.setItem("worldwiseid", data.token);
        dispatch({ type: "login", payload: data.data });
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function login(email, password) {
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (res.status !== 200) {
        const data = await res.json();
        console.log(data.message);
        toast.error(data.message);
      } else {
        toast.success("Logged in successfully");
        const data = await res.json();
        localStorage.setItem("worldwiseid", data.token);
        dispatch({ type: "login", payload: data.data[0] });
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function googleSignIn(username, email, photo) {
    const res = await fetch(`${API}/api/v1/auth/googleAuth`, {
      method: "POST",
      body: JSON.stringify({ username, email, photo }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    return res;
  }

  function logout() {
    toast.success("Logged out successfully");
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        dispatch,
        isAuthenticated,
        signup,
        login,
        logout,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside the AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
