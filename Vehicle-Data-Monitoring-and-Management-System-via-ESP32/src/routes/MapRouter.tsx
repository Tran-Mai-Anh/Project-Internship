import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "../views/Login/Login";
import Register from "../views/Register/Register";
import Layout from "../layouts/Layout";
import AllVehicles from "../views/AllVehicles/AllVehicles";
import TotalMileage from "../views/TotalMileage";
import MileageReport from "../views/MileageReport";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />, // ✅ thay vì RegisterCar
  },
  {
    path: "/monitor",
    element: <Layout />,
    children: [
      {
        path: "all-vehicles",
        element: <AllVehicles />,
      },
    ],
  },
  {
    path: "/report",
    element: <Layout />,
    children: [
      {
        path: "total-mileage",
        element: <TotalMileage />,
      },
      {
        path: "mileage-report",
        element: <MileageReport />,
      },
    ],
  },
]);

export function MapRouter() {
  return <RouterProvider router={router} />;
}
