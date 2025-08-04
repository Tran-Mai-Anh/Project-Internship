import "./AllVehicles.css";
import { IoSearch } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useCallback, useEffect, useRef, useState } from "react";
import car_running from "../../assets/car_running.svg";
import { FaMapMarkerAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import Map from "../../components/Map/Map";
import OptionDetail from "../../components/OptionDetail/OptionDetail";
import VehicleDetail from "../../components/VehicleDetail/VehicleDetail";
import axiosInstance from "../../axiosInstance";


interface Vehicle{
  id : number;
  imei : string;
  licensePlate: string;
  simPhoneNumber: string;
  vehicleType:string;
  createdAt:string;
  updatedAt:string;
}


interface PositionVehicle{
vehicleId:number,
latitude:number,
longitude:number,
timestamp:string
}


const AllVehicles = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOptionDetailOpen, setIsOptionDetailOpen] = useState(false);
  const [isVehicleDetailOpen, setIsVehicleDetailOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [currentLocation, setCurrentLocation] = useState<any | null>(null);
  const [vehicleType, setVehicleType] = useState<string>("car"); 
  const [position,setPosition] = useState<[number,number] | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

  const [allVehicles,setAllVehicles] = useState<Vehicle[]>([
 
]);

  useEffect(()=>{
    async function getAllVehicles(){
      try {
        const response = await axiosInstance.get("vehicles/all-vehicles");
        console.log(response.data);
        setAllVehicles(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getAllVehicles();
  },[]);



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


  const getPositionOfVehicle = useCallback(async (id : number)=>{
    try {
      const response = await axiosInstance.get(`locations/${id}/current`);
    console.log(response);
      const data : PositionVehicle = response.data;
      setPosition([data.latitude,data.longitude]);
    } catch (error) {
      console.error(error);
    }
  },[]);

  return (
    <div className="allVehiclesPage">
      <div className="mapContainer">
        <div className="mapPlaceholder">
          <Map
            position={
              position
            }
            vehicleType={vehicleType} // "car" hoặc "motorbike"
          />
        </div>
      </div>

      <div className="vehicleListContainer">
        <div className="titleVehicleListContainer">
          <div className="titleVehicleListDiv">
            <h1 className="titleVehicleList">Danh sách xe</h1>
            <span className="totalVehicle">{allVehicles.length}</span>
          </div>
          {/* <button className="addVehicleList">
            <FaPlus className="addIconVehicleList" />
          </button> */}
        </div>
        {/* <div className="searchVehicleListContainer">
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
        </div> */}
       {allVehicles.map(each => {
  const isOpen = selectedVehicleId === each.id;

  return (
    <div key={each.id} className="vehicleDetailAllVehicleContainer" onClick={() => {
      getPositionOfVehicle(each.id);
      setVehicleType(each.vehicleType);
    }}>
      {/* ... */}
      <div className="popupWrapper">
        <button
          className="moreDetailAllVehicle"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedVehicleId(isOpen ? null : each.id);
          }}
        >
          {each.brand}
          <HiDotsVertical className="moreDetailIconAllVehicle" />
        </button>

        {isOpen && (
          <div ref={popupRef} className="optionPopupWrapper">
            <OptionDetail onClose={handleOptionClose} />
          </div>
        )}
      </div>
    </div>
  );
})}

      </div>

      <VehicleDetail
        isOpen={isVehicleDetailOpen}
        onClose={() => setIsVehicleDetailOpen(false)}
      />
    </div>
  );
};

export default AllVehicles;
