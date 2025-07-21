import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="layoutContainer">
      <div className="sidebarContainerLo">
        <Sidebar/>
      </div>
      <div className="mainContent">
        <div className="headerContainerLo">
          <Header />
        </div>
        <main className="viewContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
