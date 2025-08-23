import "./EditThemeModal.css";

interface EditThemeModalProps {
  open: boolean;
  onClose: () => void;
}

const EditThemeModal = ({ open, onClose }: EditThemeModalProps) => {
  if (!open) return null;

  return (
    <div className="themeModalBackdrop" onClick={onClose}>
      <div className="themeModal" onClick={(e) => e.stopPropagation()}>
        <div className="themeModalHeader">
          <h2>Chỉnh sửa giao diện</h2>
          <button className="themeModalClose" onClick={onClose}>✕</button>
        </div>

        <div className="themeGroup">
          <p className="themeLabel">Ngôn ngữ</p>
          <div className="segmented">
            <button className="seg active">🇻🇳 Tiếng Việt</button>
            <button className="seg">🇺🇸 English</button>
          </div>
        </div>

        <div className="themeGroup">
          <p className="themeLabel">Thanh bên</p>
          <div className="segmented">
            <button className="seg active">Mặc định</button>
            <button className="seg">Thu gọn</button>
            <button className="seg">Ẩn</button>
          </div>
        </div>

        <div className="themeGroup">
          <p className="themeLabel">Thanh trạng thái</p>
          <div className="segmented">
            <button className="seg active">Hiện</button>
            <button className="seg">Ẩn</button>
          </div>
        </div>

        <button className="resetBtn">↻ Đặt lại</button>
      </div>
    </div>
  );
};

export default EditThemeModal;
