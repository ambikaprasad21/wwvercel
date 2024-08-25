import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function TrackLocation() {
  const location = useLocation();

  useEffect(() => {
    // Store the current URL in localStorage whenever it changes
    localStorage.setItem("lastVisitedUrl", location.pathname + location.search);
  }, [location]);

  return null; // This component does not render anything
}

export default TrackLocation;
