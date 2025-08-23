import { useState } from "react";
import "./UpdateAccountModal.css";

interface UpdateAccountModalProps {
  user: { name: string; email: string; address: string };
  onClose: () => void;
  onSave: (updatedUser: { name: string; email: string; address: string }) => void;
}

const UpdateAccountModal = ({ user, onClose, onSave }: UpdateAccountModalProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, address });
  };

  return (
    <div className="modalBackdrop">
      <div className="modalContainer">
        <h2>Cập nhật tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Tên *
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Email *
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label>
            Địa chỉ
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>

          <div className="modalActions">
            <button type="button" onClick={onClose}>Đóng</button>
            <button type="submit" className="confirmBtn">Xác nhận</button>
          </div>
        </form>

        <div className="extraActions">
          <button className="linkBtn">Chỉnh sửa mật khẩu</button>
          <button className="logoutBtn">Đăng xuất trên mọi thiết bị</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccountModal;
