/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import "../static/resources/css/Home.css";
import "../components/AppNavBar.css";
import Navbar from "../components/AppNavBar";

// eslint-disable-next-line react/prop-types
function Home({ user }) {
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, [user]);

  return (
    <div className="home-container">
      <Navbar /> {/* Se agrega el Navbar en la parte superior */}
      <main className="home-main">
        <h2 className="welcome-text">
          Hola usuario: {currentUser?.username || "Desconocido"}
        </h2>
      </main>
    </div>
  );
}

export default Home;
