import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Typography } from "@mui/material";
function Header() {
  // const [username,setUsername]=useState(null);
  const { userInfo, setUserInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        // setUsername(userInfo.username);
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;
  return (
    <header className="header">
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography
          variant="h4"
          style={{ marginRight: "auto", marginTop: "10px", marginLeft: "10px" }}
        >
          ChatRoom
        </Typography>
        {username && (
          <>
            <div
              className="loggedIn"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <span
                style={{
                  fontFamily: "cursive",
                  fontSize: "25px",
                }}
              >
                Hello,{"  " + username}
              </span>
              <a
                style={{
                  marginLeft: "5px",
                  marginRight: "50px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={logout}
              >
                logout
              </a>
            </div>
          </>
        )}
        {!username && (
          <div
            className="notLoggedIn"
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <Link
              to="/register"
              className="btn"
              style={{ textDecoration: "none" }}
            >
              Register
            </Link>
            <Link
              to="/login"
              className="btn"
              style={{ textDecoration: "none" }}
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
