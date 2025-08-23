import type React from "react";
import "./Logout.css";
import { IoLogOutOutline, IoColorPaletteOutline, IoPersonOutline, IoKeyOutline } from "react-icons/io5";

interface LogoutProps {
  onLogout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  return (
    <div className="logoutContainer">
      <div className="profileHeader">
        <div className="avatarCircle">VD</div>
        <div className="profileDetails">
          <p className="profileName">Vietmap Demo</p>
          <p className="profilePhone">12345678901</p>
          <p className="profileEmail">vietmapdemo@vietmap.vn</p>
        </div>
      </div>
      
      <div className="logoutOption" onClick={onLogout}>
        <IoColorPaletteOutline className="logoutIcon" />
        Chỉnh sửa giao diện
      </div>
      <div className="logoutOption" onClick={onLogout}>
        <IoPersonOutline className="logoutIcon" />
        Cập nhật tài khoản
      </div>
      <div className="logoutOption" onClick={onLogout}>
        <IoKeyOutline className="logoutIcon" />
        Đổi mật khẩu
      </div>
      <div className="logoutOption" onClick={onLogout}>
        <IoLogOutOutline className="logoutIcon" />
        Đăng xuất
      </div>
    </div>
  );
};

export default Logout;
