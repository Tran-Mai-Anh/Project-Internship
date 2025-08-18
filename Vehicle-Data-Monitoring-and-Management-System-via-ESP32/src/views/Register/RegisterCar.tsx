/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import logoFull from "../../assets/logoFull.png";
import "./RegisterCar.css";
import { MdOutlineReportProblem } from "react-icons/md";

interface FieldError {
  Field: string;
  Error: string;
}

const fields = {
  imei: "Imei",
  vehicleType: "VehicleType",
  licensePlate: "LicensePlate",
  simPhoneNumber: "SimPhoneNumber",
  brand: "Brand",
};

const RegisterCar = ({
  onNext,
  defaultData,
  fieldErrors,
  setFieldErrors,
}: {
  onNext: (carData: any) => void;
  defaultData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    imei: string;
    licensePlate: string;
    simPhoneNumber: string;
    brand: string;
    vehicleType: string;
  };
  fieldErrors: FieldError[];
  setFieldErrors: React.Dispatch<React.SetStateAction<FieldError[]>>;
}) => {
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

  const options = ["Xe máy", "Ô tô"];
  const [selected, setSelected] = useState(carInfo.vehicleType || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numericFields = ["imei", "simPhoneNumber"];
    if (numericFields.includes(name)) {
      const onlyNumbers = value.replace(/\D/g, ""); 
      setCarInfo((prev) => ({ ...prev, [name]: onlyNumbers }));
    } else {
      setCarInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const errors: FieldError[] = [];

    if (!carInfo.imei.trim()) {
      errors.push({
        Error: "Bắt buộc",
        Field: "Imei",
      });
    }

    if (!carInfo.licensePlate.trim()) {
      errors.push({
        Error: "Bắt buộc",
        Field: "LicensePlate",
      });
    }

    if (!carInfo.simPhoneNumber.trim()) {
      errors.push({
        Error: "Bắt buộc",
        Field: "SimPhoneNumber",
      });
    } else if (!/^\d{10,11}$/.test(carInfo.simPhoneNumber)) {
      errors.push({
        Error: "Số điện thoại phải có 10 đến 11 số",
        Field: "SimPhoneNumber",
      });
    }

    if (!carInfo.brand.trim()) {
      errors.push({
        Error: "Bắt buộc",
        Field: "Brand",
      });
    }

    if (!selected) {
      errors.push({
        Error: "Bắt buộc",
        Field: "VehicleType",
      });
    }

    if (errors.length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors([]);
    onNext({ ...carInfo, vehicleType: selected });
  };

  const trackingError = (errorName: string): FieldError | null => {
    const found = fieldErrors.find((each) =>
      each.Field.toLowerCase().includes(errorName.toLowerCase())
    );
    return found || null;
  };

  return (
    <div className="register-background">
      <div className="registerCar-form">
        <form>
          <img src={logoFull} alt="Logo" />
          <div className="inputGroup">
            <p>
              IMEI <span className="force">*</span>
            </p>
            <div
              className={`imei ${isImeiFocused ? "active" : ""} ${
                trackingError(fields.imei) ? "error" : ""
              }`}
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
            {trackingError(fields.imei) && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">
                  {trackingError(fields.imei)?.Error}
                </p>
              </div>
            )}
          </div>

          <div className="inputGroup">
            <p>
              Biển số <span className="force">*</span>
            </p>
            <div
              className={`plate ${isPlateFocused ? "active" : ""} ${
                trackingError(fields.licensePlate) ? "error" : ""
              }`}
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
            {trackingError(fields.licensePlate) && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">
                  {trackingError(fields.licensePlate)?.Error}
                </p>
              </div>
            )}
          </div>

          <div className="inputGroup">
            <p>
              Số điện thoại SIM <span className="force">*</span>
            </p>
            <div
              className={`simphone ${isSimPhoneFocused ? "active" : ""} ${
                trackingError(fields.simPhoneNumber) ? "error" : ""
              }`}
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
            {trackingError(fields.simPhoneNumber) && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">
                  {trackingError(fields.simPhoneNumber)?.Error}
                </p>
              </div>
            )}
          </div>

          <div className="inputGroup">
            <p>
              Hãng xe <span className="force">*</span>
            </p>
            <div
              className={`brand ${isBrandFocused ? "active" : ""} ${
                trackingError(fields.brand) ? "error" : ""
              } `}
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
            {trackingError(fields.brand) && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">
                  {trackingError(fields.brand)?.Error}
                </p>
              </div>
            )}
          </div>

          <div className="type">
            <p>Loại <span className="forceInput">*</span></p>
            {options.map((option) => (
              <label key={option} className="custom-radio">
                <input
                  type="radio"
                  name="vehicleType"
                  value={option}
                  checked={selected === option}
                  onChange={() => setSelected(option)}
                />
                <span className="force">{option}</span>
              </label>
            ))}
            {trackingError(fields.vehicleType) && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">
                  {trackingError(fields.vehicleType)?.Error}
                </p>
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
