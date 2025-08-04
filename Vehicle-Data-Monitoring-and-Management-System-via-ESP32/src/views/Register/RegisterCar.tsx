import React, { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import logoFull from "../../assets/logoFull.png";
import "./RegisterCar.css";
import { MdOutlineReportProblem } from "react-icons/md";

const RegisterCar = ({ onNext, defaultData }: any) => {
  const navigate = useNavigate();

  const [carInfo, setCarInfo] = useState({
    imei: defaultData.imei || "",
    licensePlate: defaultData.licensePlate || "",
    simPhoneNumber: defaultData.simPhoneNumber || "",
    brand: defaultData.brand || "",
    vehicleType: defaultData.vehicleType || "",
  });

  const [isImeiFocused, setImeiIsFocused] = useState(false);
  const [isPlateFocused, setPlateIsFocused] = useState(false);
  const [isSimPhoneFocused, setSimPhoneIsFocused] = useState(false);
  const [isBrandFocused, setBrandIsFocused] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [shake, setShake] = useState<any>({
    imei: false,
    licensePlate: false,
    simPhoneNumber: false,
    brand: false,
    vehicleType: false,
  });

  const options = ["Xe máy", "Ô tô"];
  const [selected, setSelected] = useState(carInfo.vehicleType || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Chỉ cho phép nhập số cho các trường này
    const numericFields = ["imei", "simPhoneNumber"];
    if (numericFields.includes(name)) {
      const onlyNumbers = value.replace(/\D/g, ""); // xóa mọi ký tự không phải số
      setCarInfo((prev) => ({ ...prev, [name]: onlyNumbers }));
    } else {
      setCarInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const triggerShake = (field: string) => {
    setShake((prev: any) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setShake((prev: any) => ({ ...prev, [field]: false }));
    }, 500);
  };

  const handleSubmit = () => {
    const errors: any = {};

    if (!carInfo.imei.trim()) {
      errors.imei = "Bắt buộc";
      triggerShake("imei");
    }

    if (!carInfo.licensePlate.trim()) {
      errors.licensePlate = "Bắt buộc";
      triggerShake("licensePlate");
    }

    if (!carInfo.simPhoneNumber.trim()) {
      errors.simPhoneNumber = "Bắt buộc";
      triggerShake("simPhoneNumber");
    } else if (!/^\d{10,11}$/.test(carInfo.simPhoneNumber)) {
      errors.simPhoneNumber = "Số điện thoại phải có 10 hoặc 11 chữ số";
      triggerShake("simPhoneNumber");
    }

    if (!carInfo.brand.trim()) {
      errors.brand = "Bắt buộc";
      triggerShake("brand");
    }

    if (!selected) {
      errors.vehicleType = "Hãy chọn loại xe";
      triggerShake("vehicleType");
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    onNext({ ...carInfo, vehicleType: selected });
  };

  return (
    <div className="register-background">
      <div className="registerCar-form">
        <form>
          <img src={logoFull} alt="Logo" />
          <div className="inputGroup">
            <p>
              IMEI <span>*</span>
            </p>
            <div
              className={`imei ${isImeiFocused ? "active" : ""} ${
                fieldErrors.imei ? "error" : ""
              } ${shake.imei ? "shake" : ""}`}
            >
              <input
               inputMode="numeric"
               pattern="\d*"
                className="imeiInput"
                name="imei"
                value={carInfo.imei}
                onChange={handleChange}
                onFocus={() => setImeiIsFocused(true)}
                onBlur={() => setImeiIsFocused(false)}
              />
            </div>
            {fieldErrors.imei && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">{fieldErrors.imei}</p>
              </div>
            )}
          </div>

          <div className="inputGroup">
            <p>
              Biển số <span>*</span>
            </p>
            <div
              className={`plate ${isPlateFocused ? "active" : ""} ${
                fieldErrors.licensePlate ? "error" : ""
              } ${shake.licensePlate ? "shake" : ""}`}
            >
              <input
                className="plateInput"
                name="licensePlate"
                value={carInfo.licensePlate}
                onChange={handleChange}
                onFocus={() => setPlateIsFocused(true)}
                onBlur={() => setPlateIsFocused(false)}
              />
            </div>
            {fieldErrors.licensePlate && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">{fieldErrors.licensePlate}</p>
              </div>
            )}
          </div>

          <div className="inputGroup">
            <p>
              Số điện thoại SIM <span>*</span>
            </p>
            <div
              className={`simphone ${isSimPhoneFocused ? "active" : ""} ${
                fieldErrors.simPhoneNumber ? "error" : ""
              } ${shake.simPhoneNumber ? "shake" : ""}`}
            >
              <input
               inputMode="numeric"
                pattern="\d*"
                className="simphoneInput"
                name="simPhoneNumber"
                value={carInfo.simPhoneNumber}
                onChange={handleChange}
                onFocus={() => setSimPhoneIsFocused(true)}
                onBlur={() => setSimPhoneIsFocused(false)}
              />
            </div>
            {fieldErrors.simPhoneNumber && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">{fieldErrors.simPhoneNumber}</p>
              </div>
            )}
          </div>

          <div className="inputGroup">
            <p>
              Hãng xe <span>*</span>
            </p>
            <div
              className={`brand ${isBrandFocused ? "active" : ""} ${
                fieldErrors.brand ? "error" : ""
              } ${shake.brand ? "shake" : ""}`}
            >
              <input
                className="brandInput"
                name="brand"
                value={carInfo.brand}
                onChange={handleChange}
                onFocus={() => setBrandIsFocused(true)}
                onBlur={() => setBrandIsFocused(false)}
              />
            </div>
            {fieldErrors.brand && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">{fieldErrors.brand}</p>
              </div>
            )}
          </div>

          <div className="type">
            <p>Loại</p>
            {options.map((option) => (
              <label key={option} className="custom-radio">
                <input
                  type="radio"
                  name="vehicleType"
                  value={option}
                  checked={selected === option}
                  onChange={() => setSelected(option)}
                />
                <span>{option}</span>
              </label>
            ))}
            {fieldErrors.vehicleType && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">{fieldErrors.vehicleType}</p>
              </div>
            )}
          </div>
        </form>

        <div className="next">
          <button className="nextButton" type="button" onClick={handleSubmit}>
            Tiếp theo <FaArrowRightLong />
          </button>
        </div>

        <div className="loginDiv">
          <p>Đã có tài khoản?</p>
          <button
            type="button"
            className="loginButtonSmall"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterCar;
