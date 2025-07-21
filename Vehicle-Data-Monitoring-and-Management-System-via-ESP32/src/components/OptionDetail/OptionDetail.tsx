import "./OptionDetail.css";
import { GoInfo } from "react-icons/go";
import { GoHistory } from "react-icons/go";

interface OptionDetailProps {
  onClose: (action: "details" | "route") => void;
}

const OptionDetail = ({ onClose }: OptionDetailProps) => {
  return (
    <div className="optionDetailContainer">
      <div className="optionItem" onClick={() => onClose("details")}>
        <GoInfo className="optionIcon" />
        Chi tiết xe
      </div>
      <div className="optionItem" onClick={() => onClose("route")}>
        <GoHistory className="optionIcon" />
        Xem lại lộ trình
      </div>
    </div>
  );
};

export default OptionDetail;
