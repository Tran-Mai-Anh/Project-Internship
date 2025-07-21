import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./VehicleDetail.css";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRoad } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface VehicleDetailProps {
  isOpen: boolean;
  onClose: () => void;
}

const VehicleDetail = ({ isOpen, onClose }: VehicleDetailProps) => {
  if (!isOpen) return null;

  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const modalContent = (
    <div className="vehicleDetailOverlay" onClick={onClose}>
      <div
        className="vehicleDetailContainer"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="vehicleDetailHeader">
          <h2>Chi tiết xe - Demo</h2>
          <button className="closeBtn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="vehicleDetailBody">
          <div className="row1Detail">
            <fieldset className="everydaySection">
              <legend>Hàng ngày</legend>
              <p>
                <span>Bắt đầu:</span> 15/07/2025 07:59:06
              </p>
              <p>
                <span>Quãng đường:</span> 24.82 Km
              </p>
              <p>
                <span>Di chuyển:</span> 00:39:29
              </p>
              <p>
                <span>Dừng:</span> 00:08:41
              </p>
            </fieldset>

            <fieldset className="detailSection">
              <legend>Thông tin thiết bị</legend>
              <p>
                <span>Loại:</span> MT20B
              </p>
              <p>
                <span>IMEI:</span> *********
              </p>
              <p>
                <span>SĐT SIM:</span> *********
              </p>
              <p>
                <span>Gói cước:</span> MOTO1T (17/01/2022)
              </p>
            </fieldset>
          </div>

          <div className="row2Detail">
            <fieldset className="manageDetail">
              <legend>Quản lý</legend>
              <div className="editFunction">
                <button className="editBtn">
                  <MdModeEdit className="editIcon" />
                </button>
                <p>Chỉnh sửa</p>
              </div>
              <div className="deleteFunction">
                <button className="deleteBtn">
                  <MdDelete className="deleteIcon" />
                </button>
                <p>Xoá</p>
              </div>
            </fieldset>

            <fieldset className="reportDetail">
              <legend>Báo cáo</legend>
              <div className="reportFunction">
                <button
                  className="reportBtn"
                  onClick={() => navigate("/report/mileage-report")}
                >
                  <FaRoad className="reportIcon" />
                </button>
                <p>Quãng đường theo xe</p>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="footer">
          <button className="closeModalBtn" onClick={onClose}>
            <IoClose className="closeIcon" />
            Đóng
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default VehicleDetail;
