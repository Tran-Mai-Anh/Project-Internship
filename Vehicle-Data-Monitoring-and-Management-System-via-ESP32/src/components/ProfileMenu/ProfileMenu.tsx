import type React from "react";
import "./ProfileMenu.css";
import { IoLogOutOutline, IoColorPaletteOutline, IoPersonOutline, IoKeyOutline } from "react-icons/io5";

interface User {
  name: string;
  email: string;
  userId: number;
}

interface ProfileMenuProps {
  user: User;
  onEditTheme: () => void;
  onUpdateAccount: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  onEditTheme,
  onUpdateAccount,
  onChangePassword,
  onLogout,
}) => {
  return (
    <div className="profileMenuContainer">
      {/* Header */}
      <div className="profileHeader">
        <div className="avatarCircle">
          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="profileDetails">
          <p className="profileName">{user.name}</p>
          <p className="profileEmail">{user.email}</p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="menuOption" onClick={onEditTheme}>
        <IoColorPaletteOutline className="menuIcon" />
        <span>Chỉnh sửa giao diện</span>
      </div>
      <div className="menuOption" onClick={onUpdateAccount}>
        <IoPersonOutline className="menuIcon" />
        <span>Cập nhật tài khoản</span>
      </div>
      <div className="menuOption" onClick={onChangePassword}>
        <IoKeyOutline className="menuIcon" />
        <span>Đổi mật khẩu</span>
      </div>
      <div className="menuOption" onClick={onLogout}>
        <IoLogOutOutline className="menuIcon" />
        <span>Đăng xuất</span>
      </div>
    </div>
  );
};


export default ProfileMenu;
