import type React from "react";
import "./Logout.css";
import { IoLogOutOutline } from "react-icons/io5";

interface LogoutProps {
  onLogout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  return (
    <div className="logoutContainer">
      <div className="logoutOption" onClick={onLogout}>
        <IoLogOutOutline className="logoutIcon" />
        Đăng xuất
      </div>
    </div>
  );
};

export default Logout;
