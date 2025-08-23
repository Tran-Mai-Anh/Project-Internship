import "./NoDataPage.css";
import nodataImg from "../../assets/nodata.png";

const NoDataPage = () => {
  return (
    <div className="noDataContainer">
      <img src={nodataImg} alt="No data" className="noDataImage" />
      <h2>Không có dữ liệu</h2>
      <p>Hiện tại không có dữ liệu để hiển thị, vui lòng thử lại sau.</p>
    </div>
  );
};

export default NoDataPage;
