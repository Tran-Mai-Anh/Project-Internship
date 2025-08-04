import React, { useState } from "react";
import { MdOutlineEmail, MdOutlineReportProblem } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import logoFull from "../../assets/logoFull.png";
import "./RegisterAccount.css";
import { FaRegUser } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const RegisterAccount = ({ onRegister, defaultData }: any) => {
 const [accountInfo, setAccountInfo] = useState({
  name: defaultData.name || "",
  email: defaultData.email || "",
  address: defaultData.address || "",
  password: defaultData.password || "",
  confirmPassword: "",
});

 const [errors, setErrors] = useState({
  name: "",
  email: "",
  address: "",
  password: "",
  confirmPassword: "",
});

const [shake, setShake] = useState({
  name: false,
  email: false,
  address: false,
  password: false,
  confirmPassword: false,
});

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    // Mật khẩu >=8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const isNumeric = (value: string) => /^\d+$/.test(value);

  const triggerShake = (field: keyof typeof shake) => {
    setShake((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setShake((prev) => ({ ...prev, [field]: false }));
    }, 500);
  };

  const handleSubmit = () => {
    let valid = true;
    let newErrors = { name: "", email: "", address: "", password: "", confirmPassword: "" };

    if (!accountInfo.name) {
      newErrors.name = "Bắt buộc";
      triggerShake("name");
      valid = false;
    }

    if (!accountInfo.email) {
      newErrors.email = "Bắt buộc";
      triggerShake("email");
      valid = false;
    } else if (!validateEmail(accountInfo.email)) {
      newErrors.email = "Email không hợp lệ";
      triggerShake("email");
      valid = false;
    }

    if (!accountInfo.address) {
      newErrors.address = "Bắt buộc";
      triggerShake("address");
      valid = false;
    }

    if (!accountInfo.password) {
      newErrors.password = "Bắt buộc";
      triggerShake("password");
      valid = false;
    } else if (!validatePassword(accountInfo.password)) {
      newErrors.password =
        "Mật khẩu phải ≥8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
      triggerShake("password");
      valid = false;
    }

    if (!accountInfo.confirmPassword) {
      newErrors.confirmPassword = "Bắt buộc";
      triggerShake("confirmPassword");
      valid = false;
    } else if (accountInfo.confirmPassword !== accountInfo.password) {
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
      triggerShake("confirmPassword");
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      onRegister(accountInfo); // Gọi API nếu hợp lệ
    }
  };

  return (
    <div className="register-background">
      <div className="registerAccount-form">
        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          <img src={logoFull} />

          <div className="inputGroup">
            <p>
              Họ tên <span>*</span>
            </p>
            <div
              className={`emailLogin ${shake.name ? "shake" : ""} ${
                errors.name ? "error" : ""
              }`}
            >
              <FaRegUser className="emailIcon" />
              <input
                name="name"
                placeholder="Họ tên"
                value={accountInfo.name}
                onChange={handleChange}
                className="emailLoginInput"
              />
            </div>
            {errors.name && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">{errors.name}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="inputGroup">
            <p>
              Email <span>*</span>
            </p>
            <div
              className={`emailLogin ${shake.email ? "shake" : ""} ${
                errors.email ? "error" : ""
              }`}
            >
              <MdOutlineEmail className="emailIcon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={accountInfo.email}
                onChange={handleChange}
                className="emailLoginInput"
              />
            </div>
            {errors.email && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">{errors.email}</p>
              </div>
            )}
          </div>

          {/* Địa chỉ */}
          <div className="inputGroup">
            <p>
              Địa chỉ <span>*</span>
            </p>
            <div
              className={`emailLogin ${shake.address ? "shake" : ""} ${
                errors.address ? "error" : ""
              }`}
            >
              <GrMapLocation className="emailIcon" />
              <input
                name="address"
                placeholder="Địa chỉ"
                value={accountInfo.address}
                onChange={handleChange}
                className="emailLoginInput"
              />
            </div>
            {errors.address && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">{errors.address}</p>
              </div>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="inputGroup">
            <p>
              Mật khẩu <span>*</span>
            </p>
            <div
              className={`password ${shake.password ? "shake" : ""} ${
                errors.password ? "error" : ""
              }`}
            >
              <IoIosLock className="passwordIcon" />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={accountInfo.password}
                onChange={handleChange}
                className="passwordInput"
              />
            </div>
            {errors.password && (
              <div className="errorNotification">
                <MdOutlineReportProblem />
                <p className="errorMessage">{errors.password}</p>
              </div>
            )}
          </div>
{/* Nhập lại mật khẩu */}
<div className="inputGroup">
  <p>
    Nhập lại mật khẩu <span>*</span>
  </p>
  <div
    className={`password ${shake.confirmPassword ? "shake" : ""} ${
      errors.confirmPassword ? "error" : ""
    }`}
  >
    <IoIosLock className="passwordIcon" />
    <input
      type="password"
      name="confirmPassword"
      placeholder="Nhập lại mật khẩu"
      value={accountInfo.confirmPassword}
      onChange={handleChange}
      className="passwordInput"
    />
  </div>
  {errors.confirmPassword && (
    <div className="errorNotification">
      <MdOutlineReportProblem />
      <p className="errorMessage">{errors.confirmPassword}</p>
    </div>
  )}
</div>

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
