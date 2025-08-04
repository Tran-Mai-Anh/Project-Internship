import "./Login.css";
import logoFull from "../../assets/logoFull.png";
import { MdOutlineEmail } from "react-icons/md";
import React, { useState } from "react";
import { IoIosLock } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { MdOutlineReportProblem } from "react-icons/md";

const Login = () => {
  const [isEmailFocused, setEmailIsFocused] = useState(false);
  const [isPasswordFocused, setPasswordIsFocused] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    // Reset lỗi
    setEmailError(null);
    setPasswordError(null);

    // Validate email
    if (!email) {
      setEmailError("Bắt buộc");
      triggerShake("email");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ");
      triggerShake("email");
      valid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Bắt buộc");
      triggerShake("password");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await axiosInstance.post("auth/login", {
        email,
        password,
      });
      const data = response.data;
      localStorage.setItem("token", data.token);
      navigate("/monitor/all-vehicles"); // hoặc trang khác
    } catch (error: any) {
      // Sai thông tin đăng nhập
      setEmailError("Sai tên đăng nhập hoặc mật khẩu");
      setPasswordError("Sai tên đăng nhập hoặc mật khẩu");
      triggerShake("email");
      triggerShake("password");
    }
  };

  const triggerShake = (type: "email" | "password") => {
    if (type === "email") {
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 500); // thời gian shake
    } else {
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 500);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <img src={logoFull} />
        <div className="inputGroup">
          <p>
            Email <span>*</span>
          </p>
          <div
            className={`emailLogin ${isEmailFocused ? "active" : ""} ${
              shakeEmail ? "shake" : ""
            } ${emailError ? "error" : ""}`}
          >
            <MdOutlineEmail className="emailIcon" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`emailLoginInput ${emailError ? "error" : ""}`}
              onFocus={() => setEmailIsFocused(true)}
              onBlur={() => setEmailIsFocused(false)}
            />
          </div>
          {emailError && (
            <div className="errorNotification">
              <MdOutlineReportProblem />
              <p className="errorMessage">{emailError}</p>
            </div>
          )}
        </div>

        <div className="inputGroup">
          <p>
            Mật khẩu <span>*</span>
          </p>
          <div
            className={`password ${isPasswordFocused ? "active" : ""} ${
              shakePassword ? "shake" : ""
            } ${passwordError ? "error" : ""}`}
          >
            <IoIosLock className="passwordIcon" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`passwordInput ${passwordError ? "error" : ""}`}
              onFocus={() => setPasswordIsFocused(true)}
              onBlur={() => setPasswordIsFocused(false)}
            />
          </div>
          {passwordError && (
            <div className="errorNotification">
              <MdOutlineReportProblem />
              <p className="errorMessage">{passwordError}</p>
            </div>
          )}
        </div>

        <button type="submit" className="loginButtonBig">
          Đăng nhập
        </button>
        <div className="registerDiv">
          <p>Chưa có tài khoản?</p>
          <button
            type="button"
            className="registerButtonSmall"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
