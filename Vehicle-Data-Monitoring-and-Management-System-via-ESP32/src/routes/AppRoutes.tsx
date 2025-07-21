import { Routes, Route } from "react-router-dom";
import AllVehicles from "../views/AllVehicles/AllVehicles";
import TotalMileage from "../views/TotalMileage";
import MileageReport from "../views/MileageReport";

export const AppRoutes = () => (
  <Routes>
    <Route path="/monitor/all-vehicles" element={<AllVehicles />} />
    <Route path="/report/total-mileage" element={<TotalMileage />} />
    <Route path="/report/mileage-report" element={<MileageReport />} />
  </Routes>
);
