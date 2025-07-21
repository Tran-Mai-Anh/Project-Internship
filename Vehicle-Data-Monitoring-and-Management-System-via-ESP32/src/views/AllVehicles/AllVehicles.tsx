import "./AllVehicles.css";
import { IoSearch } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import vehicle_running from "../../assets/vehicle_running.svg";
import { FaMapMarkerAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import Map from "../../components/Map/Map";
import OptionDetail from "../../components/OptionDetail/OptionDetail";
import VehicleDetail from "../../components/VehicleDetail/VehicleDetail";

const AllVehicles = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOptionDetailOpen, setIsOptionDetailOpen] = useState(false);
  const [isVehicleDetailOpen, setIsVehicleDetailOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOptionDetailOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClose = (action: "details" | "route") => {
    setIsOptionDetailOpen(false);

    if (action === "details") {
      setIsVehicleDetailOpen(true);
    } else if (action === "route") {
      console.log("Xem lại lộ trình");
    }
  };

  return (
    <div className="allVehiclesPage">
      <div className="mapContainer">
        <div className="mapPlaceholder">
          <Map />
        </div>
      </div>

      <div className="vehicleListContainer">
        <div className="titleVehicleListContainer">
          <div className="titleVehicleListDiv">
            <h1 className="titleVehicleList">Danh sách xe</h1>
            <span className="totalVehicle">1</span>
          </div>
          <button className="addVehicleList">
            <FaPlus className="addIconVehicleList" />
          </button>
        </div>
        <div className="searchVehicleListContainer">
          <button className="filterVehicleList">
            <FiFilter className="filterIconVehicleList" />
          </button>
          <div className={`searchVehicleList ${isFocused ? "active" : ""}`}>
            <IoSearch className="searchIconVehicleList" />
            <input
              placeholder="Search by ID, name"
              className="searchInputVehiclelList"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </div>
        <div className="vehicleDetailAllVehicleContainer">
          <div className="vehicleLogoTitleAllVehicleDiv">
            <div className="vehicleLogoTitleAllVehicle">
              <img
                src={vehicle_running}
                alt="logo car"
                className="logoCarVehicleList"
              />
              <div className="vehicleTitleAllVehicleDiv">
                <h3 className="vehicleTitleAllVehicle">Demo</h3>
                <p className="dateTimeAllVehicle">12/07/2025 18:20:00</p>
              </div>
            </div>
            <div className="statusAllVehicleDiv">
              <div className="realStatusAllVehicle">
                <p className="speedAllVehicle">54</p>
                <p className="unitAllVehicle">km/h</p>
              </div>
              <div className="limitStatusAllVehicle">
                <p className="speedAllVehicle">90</p>
                <p className="unitAllVehicle">km/h</p>
              </div>
            </div>
          </div>
          <div className="statusBarAllVehicle">
            <p className="statusAllVehicle">Đang chạy 54 km/h</p>
          </div>
          <div className="statusAddressAllVehicle">
            <FaMapMarkerAlt className="mapIconAllVehicle" />
            <p>2661 Đại Lộ Hùng Vương, P.Ba Ngòi, Khánh Hoà, Việt Nam</p>

            <div className="popupWrapper">
              <button
                className="moreDetailAllVehicle"
                onClick={() => setIsOptionDetailOpen((prev) => !prev)}
              >
                <HiDotsVertical className="moreDetailIconAllVehicle" />
              </button>

              {isOptionDetailOpen && (
                <div ref={popupRef} className="optionPopupWrapper">
                  <OptionDetail onClose={handleOptionClose} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <VehicleDetail
        isOpen={isVehicleDetailOpen}
        onClose={() => setIsVehicleDetailOpen(false)}
      />
    </div>
  );
};

export default AllVehicles;
