import React, {useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./style.scss";
import { useAuth } from "../../contexts";
import axios from "axios";

const NavBar = () => {

  const { user, setUser } = useAuth();

  const [width,setWidth] = useState(window.innerWidth)

  const [menuActive, setMenuActive] = useState(false)

  const activeStyle = {
    outline: "solid 2px #FAF8F2",
    backgroundColor: "var(--outline)",
  };

  const mobileStyle = {
    outline: "solid 2px #FAF8F2",
    backgroundColor: "var(--outline)",
  }

  const navActive = ({ isActive }) => (isActive ? activeStyle : undefined);

  const mobileActive = ({ isActive }) => (isActive ? mobileStyle : undefined);

  function logout() {
    setUser("");
  }

  function handleResize(){
    setWidth(window.innerWidth)
  }

  function handleMenuClick(){
    setMenuActive(!menuActive)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={width <= 850 ? "parent" : ""}>
      <nav className={width <= 850 ? "mobile" : "nav-row"}>
        <img onClick={handleMenuClick} id="logo" src={width <= 850 ? 'https://res.cloudinary.com/de2nposrf/image/upload/v1697042188/static/small_logo.png' : 'https://res.cloudinary.com/de2nposrf/image/upload/v1697042188/static/logo.png'} alt="API Image" />

        <ul  style={width <= 850 ? menuActive ? {"display":"block"} : {"display":"none"} : {} }>
          <li>
            <NavLink to="/" style={width > 850 ? navActive : {} }>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/explore" style={width > 850 ? navActive : {} }>
              Explore
            </NavLink>
          </li>
          <div className="generate-nav">
            {user ? (
              <li>
                <NavLink to="/generate" style={width > 850 ? navActive : {} }>
                  Create
                </NavLink>
              </li>
            ) : (
              ""
            )}
          </div>
          <div className="login-nav">
            {user ? (
              <li>
                <NavLink to="/profile" style={width > 850 ? navActive : {} }>
                  Profile
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink to="/login" style={width > 850 ? navActive : {} }>
                  Login
                </NavLink>
              </li>
            )}
          </div>
          <div className="logout-nav">
            {user ? (
              <li>
                <NavLink to="/" onClick={logout}>
                  Log Out
                </NavLink>{" "}
              </li>
            ) : (
              ""
            )}
          </div>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default NavBar;
