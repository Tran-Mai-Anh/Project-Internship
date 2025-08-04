import "./Sidebar.css";
import logoSidebar from "../../assets/logoFull.png";
import { IoIosArrowDropleft } from "react-icons/io";
import { FiMonitor } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { IoGolf } from "react-icons/io5";
import { FaBell } from "react-icons/fa6";
import { BsCalendarEventFill } from "react-icons/bs";
import { IoNewspaper } from "react-icons/io5";
import { FaChartPie } from "react-icons/fa";
import { SiVirustotal } from "react-icons/si";
import { FaRoad } from "react-icons/fa";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [monitor, setMonitor] = useState(true);
  const [notification, setNotification] = useState(true);
  const [report, setReport] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const hanldeMonitor = () => {
    setMonitor((prev) => !prev);
  };
  const hanldeNotification = () => {
    setNotification((prev) => !prev);
  };
  const handleReport = () => {
    setReport((prev) => !prev);
  };

  return (
    <div className="sidebarContainer">
      <div className="sidebarNav">
        <div className="logoDiv">
          <img src={logoSidebar} alt="logo sidebar" className="logoSidebar" />
        </div>
        {/* <div className="arrowDropLeftDiv">
          <IoIosArrowDropleft className="arrowDropLeft" />
        </div> */}
      </div>
      <ul className="menuList">
        <li className="mainTitle">
          <div className="menuTitle" onClick={hanldeMonitor}>
            <div className="title">
              <FiMonitor className="iconTitle" />
              Giám sát
            </div>
            <IoIosArrowForward
              className={`iconDown ${monitor ? "rotateIcon" : ""}`}
            />
          </div>
          <ul className={`subMenu ${monitor ? "open" : ""}`}>
            <li
              className={`subTitle ${
                currentPath === "/monitor/all-vehicles" ? "active" : ""
              }`}
              onClick={() => navigate("/monitor/all-vehicles")}
            >
              <FaCar className="iconTitle" />
              Tất cả xe
            </li>
            {/* <li className="subTitle">
              <IoGolf className="iconTitle" />
              Vùng giới hạn
            </li> */}
          </ul>
        </li>
        {/* <li className="mainTitle">
          <div className="menuTitle" onClick={hanldeNotification}>
            <div className="title">
              <FaBell className="iconTitle" />
              Thông báo
            </div>
            <IoIosArrowForward
              className={`iconDown ${notification ? "rotateIcon" : ""}`}
            />
          </div>
          <ul className={`subMenu ${notification ? "open" : ""}`}>
            <li className="subTitle">
              <BsCalendarEventFill className="iconTitle" />
              Sự kiện
            </li>
            <li className="subTitle">
              <IoNewspaper className="iconTitle" />
              Tin tức
            </li>
          </ul>
        </li> */}
        {/* <li className="mainTitle">
          <div className="menuTitle" onClick={handleReport}>
            <div className="title">
              <FaChartPie className="iconTitle" />
              Báo cáo
            </div>
            <IoIosArrowForward
              className={`iconDown ${report ? "rotateIcon" : ""}`}
            />
          </div>
          <ul className={`subMenu ${report ? "open" : ""}`}>
            <li
              className={`subTitle ${
                currentPath === "/report/total-mileage" ? "active" : ""
              }`}
              onClick={() => navigate("/report/total-mileage")}
            >
              <SiVirustotal className="iconTitle" />
              Tổng quãng đường
            </li>
            <li
              className={`subTitle ${
                currentPath === "/report/mileage-report" ? "active" : ""
              }`}
              onClick={() => navigate("/report/mileage-report")}
            >
              <FaRoad className="iconTitle" />
              Quãng đường theo xe
            </li>
          </ul>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
