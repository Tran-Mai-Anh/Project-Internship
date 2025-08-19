
//import "./App.css";
import { MapRouter } from "./routes/MapRouter";
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
