import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./App.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    const iframe = document.getElementById("profile-iframe");
    console.log(location.pathname.split("/")[2]);
    iframe.src = `http://localhost:8000/profile/${
      location.pathname.split("/")[2]
    }`;
  }, [location.pathname]);

  return (
    <>
      <iframe
        id="profile-iframe"
        src="about:blank"
        width="100%"
        height="400"
      ></iframe>
    </>
  );
}

export default App;
