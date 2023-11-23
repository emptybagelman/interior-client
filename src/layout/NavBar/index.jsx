import React, {useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./style.scss";
import { useAuth } from "../../contexts";
import axios from "axios";

const NavBar = () => {

  const { user, setUser,width } = useAuth();

  const navigate = useNavigate()

  const [menuActive, setMenuActive] = useState(false)

  const activeStyle = {
    outline: "solid 2px #FAF8F2",
    backgroundColor: "var(--bg)",
  };

  const mobileStyle = {
    outline: "solid 2px #FAF8F2",
    backgroundColor: "var(--bg)",
  }

  const navActive = ({ isActive }) => (isActive ? activeStyle : undefined);

  const mobileActive = ({ isActive }) => (isActive ? mobileStyle : undefined);

  function logout() {
    setUser("");
  }

  function handleMenuClick(){
    if(width <= 850){
      setMenuActive(!menuActive)
    }else{
      navigate("/")
    }
  }

  return (
    <div className={width <= 850 ? "parent" : ""}>
      <nav className={width <= 850 ? "mobile" : "nav-row"}>
        <img onClick={handleMenuClick} id="logo" src={width <= 850 ? 'https://res.cloudinary.com/de2nposrf/image/upload/v1697042188/static/small_logo.png' : 'https://res.cloudinary.com/de2nposrf/image/upload/v1697042188/static/logo.png'} alt="API Image" />

        <ul className={width <= 850 ? menuActive ? "open-menu" : "close-menu" : ""} style={width <= 850 ? menuActive ? {"display":"block"} : {"display":"none"} : {} }>
          { width <= 850 ? <p onClick={handleMenuClick}>X</p> : "" }
          <li>
            <NavLink to="/" style={width > 850 ? navActive : {} } onClick={handleMenuClick}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/explore" style={width > 850 ? navActive : {} } onClick={handleMenuClick}>
              Explore
            </NavLink>
          </li>
          <div className="generate-nav">
            {user ? (
              <li>
                <NavLink to="/generate" style={width > 850 ? navActive : {} } onClick={handleMenuClick}>
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
                <NavLink to="/profile" style={width > 850 ? navActive : {} } onClick={handleMenuClick}>
                  Profile
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink to="/login" style={width > 850 ? navActive : {} } onClick={handleMenuClick}>
                  Login
                </NavLink>
              </li>
            )}
          </div>
          <div className="logout-nav">
            {user ? (
              <li>
                <NavLink to="/" onClick={() => {logout();handleMenuClick()}}>
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
