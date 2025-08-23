import { useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { jwtDecode } from "jwt-decode";
import UpdateAccountModal from "../UpdateAccountModal/UpdateAccountModal";
import EditThemeModal from "../EditThemeModal/EditThemeModal";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";

export const Header = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [activeModal, setActiveModal] = useState<"update" | "theme" | "password" | null>(null);
  const navigate = useNavigate();

  const updateAccount = () => {
    setActiveModal(null);
  };

  // Get token from localStorage
  const token = localStorage.getItem("token");

  let user = { name: "Guest", email: "", userId: 0, address: "" };

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      user = {
        name: decoded.name,
        email: decoded.email,
        userId: decoded.UserId,
        address: decoded.address,
      };
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="headerContainer">
      <div className="appStatus">
        <button
          className="account"
          onClick={() => setShowLogout((prev) => !prev)}
        >
          <p className="avatar">
            <span className="shortName">
              {user.name ? user.name.charAt(0).toUpperCase() : "G"}
            </span>
          </p>
          <p className="fullName">{user.name || "Guest"}</p>
        </button>

        {showLogout && (
          <ProfileMenu
            user={user}
            onLogout={handleLogout}
            onEditTheme={() => {
              setShowLogout(false);  
              setActiveModal("theme");
            }}
            onUpdateAccount={() => {
              setShowLogout(false);
              setActiveModal("update");
            }}
            onChangePassword={() => {
              setShowLogout(false);
              setActiveModal("password");  // ✅ open password modal
            }}
          />
        )}

        {/* Update Account Modal */}
        {activeModal === "update" && (
          <UpdateAccountModal
            user={user}
            onClose={() => setActiveModal(null)}
            onSave={updateAccount}
          />
        )}

        {/* Edit Theme Modal */}
        <EditThemeModal
          open={activeModal === "theme"}
          onClose={() => setActiveModal(null)}
        />

        {/* Change Password Modal */}
        {activeModal === "password" && (
          <ChangePasswordModal
            onClose={() => setActiveModal(null)}
            onSave={()=> setActiveModal(null)}
          />
        )}
      </div>
    </div>
  );
};
