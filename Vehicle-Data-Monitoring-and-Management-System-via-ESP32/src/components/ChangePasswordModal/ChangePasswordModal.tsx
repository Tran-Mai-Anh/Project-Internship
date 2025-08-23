import { useState } from "react";
import "./ChangePasswordModal.css";

interface ChangePasswordModalProps {
  onClose: () => void;
  onSave: (passwords: { oldPassword: string; newPassword: string }) => void;
}

const ChangePasswordModal = ({ onClose, onSave }: ChangePasswordModalProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    onSave({ oldPassword, newPassword });
  };

  return (
    <div className="modalBackdrop">
      <div className="modalContainer">
        <h2>Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Mật khẩu cũ *
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Mật khẩu mới *
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Xác nhận mật khẩu mới *
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <div className="modalActions">
            <button type="button" onClick={onClose}>Đóng</button>
            <button type="submit" className="confirmBtn">Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
