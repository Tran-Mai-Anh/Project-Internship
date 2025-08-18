import "./AllVehicles.css";
import { IoSearch } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useCallback, useEffect, useRef, useState } from "react";
import car_running from "../../assets/car_running.svg";
import motorbike from "../../assets/motorbike.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import Map from "../../components/Map/Map";
import OptionDetail from "../../components/OptionDetail/OptionDetail";
import VehicleDetail from "../../components/VehicleDetail/VehicleDetail";
import axiosInstance from "../../axiosInstance";
import { useBackDrop } from "../Backdrop/BackdropProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import RouteHistoryModal from "../../components/History/HistoryModal";

interface Vehicle {
  id: number;
  imei: string;
  licensePlate: string;
  simPhoneNumber: string;
  brand: string;
  vehicleType: string;
  createdAt: string;
  updatedAt: string;
}

interface PositionVehicle {
  imei: string;
  pin: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed: number;
}

const mockData: Vehicle[] = [
  {
    id: 1,
    imei: "012345678910112",
    licensePlate: "51H-12345",
    simPhoneNumber: "0901234567",
    brand: "Toyota",
    vehicleType: "car",
    createdAt: "2025-08-14T08:31:57.11202Z",
    updatedAt: "2025-08-14T16:02:31.139285Z",
  },
  {
    id: 2,
    imei: "012345678910113",
    licensePlate: "51H-67890",
    simPhoneNumber: "0901234568",
    brand: "Honda",
    vehicleType: "motorbike",
    createdAt: "2025-08-14T09:15:30.11202Z",
    updatedAt: "2025-08-14T15:45:12.139285Z",
  },
];
const AllVehicles = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOptionDetailOpen, setIsOptionDetailOpen] = useState(false);
  const [isVehicleDetailOpen, setIsVehicleDetailOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [currentLocation, setCurrentLocation] = useState<any | null>(null);
  const [vehicleType, setVehicleType] = useState<string>("car");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const { showBackDrop, hideBackDrop } = useBackDrop();
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(mockData);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedVehiclePosition, setSelectedVehiclePosition] =
    useState<PositionVehicle | null>(null);
  const [isRouteHistoryModalOpen, setIsRouteHistoryModalOpen] = useState(false);

  // useEffect(() => {
  //   async function getAllVehicles() {
  //     try {
  //       showBackDrop();
  //       const response = await axiosInstance.get("vehicles/all-vehicles");
  //       setAllVehicles(response.data);
  //     } catch (error: any) {
  //       console.error(error);
  //       toast.warn("Lỗi lấy tất cả xe");
  //       toast.error(error.message);
  //     } finally {
  //       hideBackDrop();
  //     }
  //   }

  //   getAllVehicles();
  // }, []);

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
      setIsRouteHistoryModalOpen(true);
    }
  };

  const getPositionOfVehicle = useCallback(async (vehicle: Vehicle) => {
    try {
      showBackDrop();
      // const response = await axiosInstance.get(`locations/${vehicle.id}/current`);
      // const data: PositionVehicle = response.data;
      // console.log(response);

      const data: PositionVehicle = {
        imei: "012345678910112",
        pin: 70,
        latitude: 10.778965,
        longitude: 106.705963,
        timestamp: "2025-08-14T16:02:31.139285Z",
        speed: 5.17,
      };
      setPosition([data.latitude, data.longitude]);
      setSelectedVehicle(vehicle);
      setSelectedVehiclePosition(data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.warn(error.response?.data.message);
      } else {
        toast.warn("Lỗi lấy vị trí của 1 xe");
      }
    } finally {
      hideBackDrop();
    }
  }, []);

  const formatDateTime = useCallback((dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  }, []);

  const getVehicleIcon = useCallback((vehicleType: string) => {
    //return car_running;
    return vehicleType === "car" ? car_running : motorbike;
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedVehicle(null);
    setSelectedVehiclePosition(null);
    setPosition(null);
  }, []);
  return (
    <div className="allVehiclesPage">
      <div className="mapContainer">
        <div className="mapPlaceholder">
          <Map
            position={position}
            vehicleType={vehicleType}
          />
        </div>
      </div>

      <div className="vehicleListContainer">
        {!selectedVehicle && (
          <>
            <div className="titleVehicleListContainer">
              <div className="titleVehicleListDiv">
                <h1 className="titleVehicleList">Danh sách xe</h1>
                <span className="totalVehicle">{allVehicles.length}</span>
              </div>
            </div>

            {allVehicles.map((each) => (
              <div
                className="vehicleDetailAllVehicleContainer"
                onClick={() => {
                  getPositionOfVehicle(each);
                  setVehicleType(each.vehicleType);
                }}
                key={each.id}
              >
                <div className="vehicleLogoTitleAllVehicleDiv">
                  <div className="vehicleLogoTitleAllVehicle">
                    <img
                      src={getVehicleIcon(each.vehicleType)}
                      alt={`logo ${each.vehicleType}`}
                      className="logoCarVehicleList"
                    />
                    <div className="vehicleTitleAllVehicleDiv">
                      <h3 className="vehicleTitleAllVehicle">
                        {each.licensePlate}
                      </h3>
                      <p className="brandAllVehicle">{each.brand}</p>
                      <p className="dateTimeAllVehicle">
                        {formatDateTime(each.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="vehicleInfoAllVehicle">
                    <p className="imeiAllVehicle">IMEI: {each.imei}</p>
                    <p className="simAllVehicle">SIM: {each.simPhoneNumber}</p>
                    <p className="typeAllVehicle">
                      Loại: {each.vehicleType === "car" ? "Ô tô" : "Xe máy"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {selectedVehicle && selectedVehiclePosition && (
          <>
            <div className="titleVehicleListContainer">
              <div className="titleVehicleListDiv">
                <button className="backButton" onClick={handleBackToList}>
                  <FaArrowLeftLong/>
                </button>
                <h1 className="titleVehicleList">Chi tiết xe</h1>
              </div>
              <div className="actionButtons">
                <div className="popupWrapper">
                  <button
                    className="moreDetailSelectedVehicle"
                    onClick={() => setIsOptionDetailOpen((prev) => !prev)}
                  >
                    <HiDotsVertical className="moreDetailIconSelected" />
                  </button>

                  {isOptionDetailOpen && (
                    <div ref={popupRef} className="optionPopupWrapper">
                      <OptionDetail onClose={handleOptionClose} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="selectedVehicleDetailContainer">
              <div className="vehicleBasicInfo">
                <div className="vehicleLogoTitleSelected">
                  <img
                    src={getVehicleIcon(selectedVehicle.vehicleType)}
                    alt={`logo ${selectedVehicle.vehicleType}`}
                    className="logoCarSelected"
                  />
                  <div className="vehicleTitleSelectedDiv">
                    <h2 className="vehicleTitleSelected">
                      {selectedVehicle.licensePlate}
                    </h2>
                    <p className="brandSelected">{selectedVehicle.brand}</p>
                  </div>
                </div>
              </div>

              <div className="vehiclePositionInfo">
                <h3 className="sectionTitle">Thông tin vị trí</h3>
                <div className="infoGrid">
                  <div className="infoItem">
                    <span className="infoLabel">IMEI:</span>
                    <span className="infoValue">
                      {selectedVehiclePosition.imei}
                    </span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">Pin:</span>
                    <span className="infoValue">
                      {selectedVehiclePosition.pin}%
                    </span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">Vĩ độ:</span>
                    <span className="infoValue">
                      {selectedVehiclePosition.latitude}
                    </span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">Kinh độ:</span>
                    <span className="infoValue">
                      {selectedVehiclePosition.longitude}
                    </span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">Tốc độ:</span>
                    <span className="infoValue">
                      {selectedVehiclePosition.speed} km/h
                    </span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">Cập nhật:</span>
                    <span className="infoValue">
                      {formatDateTime(selectedVehiclePosition.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="vehicleStaticInfo">
                <h3 className="sectionTitle">Thông tin xe</h3>
                <div className="infoGrid">
                  <div className="infoItem">
                    <span className="infoLabel">Số điện thoại SIM:</span>
                    <span className="infoValue">
                      {selectedVehicle.simPhoneNumber}
                    </span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">Loại xe:</span>
                    <span className="infoValue">
                      {selectedVehicle.vehicleType === "car"
                        ? "Ô tô"
                        : "Xe máy"}
                    </span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">Ngày tạo:</span>
                    <span className="infoValue">
                      {formatDateTime(selectedVehicle.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* 
      {isVehicleDetailOpen && (
        <VehicleDetail onClose={() => setIsVehicleDetailOpen(false)} />
      )} */}
      {isRouteHistoryModalOpen && (
        <RouteHistoryModal
          onClose={() => setIsRouteHistoryModalOpen(false)}
          vehicleLicensePlate={selectedVehicle?.licensePlate}
          id={selectedVehicle?.id}
        />
      )}
    </div>
  );
};

export default AllVehicles;
