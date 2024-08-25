import { createContext, useContext, useEffect, useReducer } from "react";
// import { API } from "../../constants";
const API = import.meta.env.VITE_API;
import { linkClasses } from "@mui/material";
import { useAuth } from "./AuthContext";

// const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

//reducer function are pure function means we cannot make fetch request inside reducer function
//pure function do not support asynchronous behaviour
function reducer(state, action) {
  //for a large application using reducer there is a naming convention for action type names.
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id != action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  //using reducer for state managment
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { isAuthenticated } = useAuth();

  useEffect(
    function () {
      async function fetchCities() {
        dispatch({ type: "loading" });
        try {
          console.log("getting cities");
          const res = await fetch(`${API}/api/v1/data`, {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${localStorage.getItem("worldwiseid")}`,
            },
          });
          const data = await res.json();
          dispatch({ type: "cities/loaded", payload: data.data });
        } catch {
          dispatch({
            type: "rejected",
            payload: "There was error on loading cities",
          });
        }
      }

      fetchCities();
    },
    [isAuthenticated]
  );

  async function getCity(id) {
    //Anything that we get from url is string so id is a string so we converted it into integer.
    if (Number(id) === currentCity.id) return;
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${API}/api/v1/data/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("worldwiseid")}`,
        },
      });
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data.data[0] });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was error on loading cities",
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${API}/api/v1/data/create`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("worldwiseid")}`,
        },
      });
      const data = await res.json();
      // setCities((cities) => [data, ...cities]); --> how do you do this with dispatch function
      //here we need to sync the remote state with the current value
      dispatch({ type: "city/created", payload: data.data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was error on creating cities",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${API}/api/v1/data/delete`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("worldwiseid")}`,
        },
      });
      // ${BASE_URL}/cities/${id} this URL will return city with the id that we want to delete
      // then we call the delete method
      //setCities((cities) => cities.filter((city) => city.id != id));
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was error on deleting cities",
      });
    }
  }

  const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
      .map((char) => String.fromCharCode(char - 127397).toLowerCase())
      .join("");
    return (
      <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
    );
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        flagemojiToPNG,
        createCity,
        deleteCity,
      }}
    >
      {children};
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the context provider");
  return context;
}

export { CitiesProvider, useCities };
