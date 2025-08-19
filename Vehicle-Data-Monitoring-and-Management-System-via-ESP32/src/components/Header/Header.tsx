import { useState } from "react";
import "./Header.css";
import { BsCalendarEventFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Logout from "../Logout/Logout";

export const Header = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="headerContainer">
      {/* <div className={`searchHeader ${isFocused ? "active" : ""}`}>
        <IoSearch className="searchIconHeader" />
        <input
          placeholder="Search pages"
          className="searchInputHeader"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div> */}
      <div className="appStatus">
        {/* <button className="notification">
          <BsCalendarEventFill className="iconNotification" />
        </button> */}
        <button
          className="account"
          onClick={() => setShowLogout((prev) => !prev)}
        >
          <p className="avatar">
            <span className="shortName">MD</span>
          </p>
          <p className="fullName">MapData</p>
        </button>

        {showLogout && <Logout onLogout={handleLogout} />}
      </div>
    </div>
  );
};
