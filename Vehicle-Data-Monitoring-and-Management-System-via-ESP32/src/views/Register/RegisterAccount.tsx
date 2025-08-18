/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { MdOutlineEmail, MdOutlineReportProblem } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import logoFull from "../../assets/logoFull.png";
import "./RegisterAccount.css";
import { FaRegUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

const fields = {
  name: "Name",
  email: "Email",
  password: "Password",
  confirmPassword: "ConfirmPassword",
};

interface FieldError {
  Field: string;
  Error: string;
}

const RegisterAccount = ({
  onRegister,
  defaultData,
  fieldErrors,
}: {
  onRegister: (accountData: any) => Promise<void>;
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
}) => {
  const [accountInfo, setAccountInfo] = useState({
    name: defaultData.name || "",
    email: defaultData.email || "",
    password: defaultData.password || "",
    confirmPassword: "",
  });

  const [isNameFocused, setNameFocused] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onRegister(accountInfo);
  };

  const trackingError = (errorName: string): FieldError | null => {
    const found = fieldErrors.find((each) =>
      each.Field.toLowerCase().includes(errorName.toLowerCase())
    );
    return found || null;
  };

  return (
    <div className="register-background">
      <div className="registerAccount-form">
        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          <img src={logoFull} />

          <div className="inputGroup">
            <p>
              Họ tên <span className="force">*</span>
            </p>
            <div
              className={`name ${isNameFocused ? "active" : ""} ${
                trackingError(fields.name) ? "error" : ""
              }`}
            >
              <FaRegUser className="nameIcon" />
              <input
                name="name"
                placeholder="Họ tên"
                value={accountInfo.name}
                onChange={handleChange}
                className="nameInput"
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </div>
            {trackingError(fields.name) && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">
                  {trackingError(fields.name)?.Error}
                </p>
              </div>
            )}
          </div>

          <div className="inputGroup">
            <p>
              Email <span className="force">*</span>
            </p>
            <div
              className={`emailLogin ${isEmailFocused ? "active" : ""}  ${
                trackingError(fields.email) ? "error" : ""
              }`}
            >
              <MdOutlineEmail className="emailIcon" />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={accountInfo.email}
                onChange={handleChange}
                className="emailLoginInput"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </div>
            {trackingError(fields.email) && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">
                  {trackingError(fields.email)?.Error}
                </p>
              </div>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="inputGroup">
            <p>
              Mật khẩu <span className="force">*</span>
            </p>
            <div
              className={`password ${isPasswordFocused ? "active" : ""} ${
                trackingError(fields.password) ? "error" : ""
              }`}
            >
              <IoIosLock className="passwordIcon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={accountInfo.password}
                onChange={handleChange}
                className="passwordInput"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <span
                className="eyeIcon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </div>
            {trackingError(fields.password) && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">
                  {trackingError(fields.password)?.Error}
                </p>
              </div>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="inputGroup">
            <p>
              Xác nhận mật khẩu <span className="force">*</span>
            </p>
            <div
              className={`confirmPassword ${
                isConfirmPasswordFocused ? "active" : ""
              }  ${trackingError(fields.confirmPassword) ? "error" : ""}`}
            >
              <IoIosLock className="confirmPasswordIcon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={accountInfo.confirmPassword}
                onChange={handleChange}
                className="confirmPasswordInput"
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />
              <span
                className="eyeIcon"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </div>
            {trackingError(fields.confirmPassword) && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">
                  {trackingError(fields.confirmPassword)?.Error}
                </p>
              </div>
            )}
          </div>

          {/* Địa chỉ
          <div className="inputGroup">
            <p>
              Địa chỉ <span className="force">*</span>
            </p>
            <div
              className={`address ${isAddressFocused ? "active" : ""} ${
                shake.address ? "shake" : ""
              } ${errors.address ? "error" : ""}`}
            >
              <GrMapLocation className="addressIcon" />
              <input
                name="address"
                placeholder="Địa chỉ"
                value={accountInfo.address}
                onChange={handleChange}
                className="addressInput"
                onFocus={() => setAddressFocused(true)}
                onBlur={() => setAddressFocused(false)}
              />
            </div>
            {errors.address && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">{errors.address}</p>
              </div>
            )}
          </div> */}

          <button
            type="submit"
            className="registerButtonBig"
            onClick={handleSubmit}
          >
            Đăng ký
          </button>
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
        </form>
      </div>
    </div>
  );
};

export default RegisterAccount;
