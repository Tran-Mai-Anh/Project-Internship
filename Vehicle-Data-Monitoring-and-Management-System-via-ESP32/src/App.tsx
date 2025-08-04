import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
//import "./App.css";
import Layout from "./layouts/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MapRouter } from "./routes/MapRouter";
import Login from "./views/Login/Login";
import Register from "./views/Register/RegisterCar";
import { BackDropProvider } from "./views/Backdrop/BackdropProvider";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <BackDropProvider>
        <MapRouter />
      </BackDropProvider>
    </>
  );
};

export default App;
