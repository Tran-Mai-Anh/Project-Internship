import "./Login.css";
import logoFull from "../../assets/logoFull.png";
import { MdOutlineEmail } from "react-icons/md";
import React, { useState } from "react";
import { IoIosLock } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { MdOutlineReportProblem } from "react-icons/md";
import { useBackDrop } from "../Backdrop/BackdropProvider";
import { toast } from "react-toastify";
import axios from "axios";

const fields = {
  email: "Email",
  password: "Password",
};

interface FieldError {
  Field: string;
  Error: string;
}

const Login = () => {
  const [isEmailFocused, setEmailIsFocused] = useState(false);
  const [isPasswordFocused, setPasswordIsFocused] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const { showBackDrop, hideBackDrop } = useBackDrop();

  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    setFieldErrors([]);

    if (!validateEmail(email)) {
      setFieldErrors([
        {
          Field: "Email",
          Error: "Sai định dạng email",
        },
      ]);
      valid = false;
    }

    if (!valid) return;

    try {
      showBackDrop();
      const response = await axiosInstance.post("auth/login", {
        email,
        password,
      });
      const data = response.data;
      localStorage.setItem("token", data.token);
      toast.success("Đăng nhập thành công");
      navigate("/monitor/all-vehicles"); 
    } catch (error: any) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const dataError = error?.response?.data;
        if (dataError.message?.includes("Validation failed")) {
          setFieldErrors(dataError.errors);
        }
        toast.error(dataError.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      hideBackDrop();
    }
  };

  const trackingError = (errorName: string): FieldError | null => {
    const found = fieldErrors.find((each) =>
      each.Field.toLowerCase().includes(errorName.toLowerCase())
    );
    return found || null;
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
              trackingError(fields.email) ? "error" : ""
            }`}
          >
            <MdOutlineEmail className="emailIcon" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // placeholder="Enter your email"
              className={`emailLoginInput ${
                trackingError(fields.email) ? "error" : ""
              }`}
              onFocus={() => setEmailIsFocused(true)}
              onBlur={() => setEmailIsFocused(false)}
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

        <div className="inputGroup">
          <p>
            Mật khẩu <span>*</span>
          </p>
          <div
            className={`password ${isPasswordFocused ? "active" : ""} ${
              trackingError(fields.password) ? "error" : ""
            }`}
          >
            <IoIosLock className="passwordIcon" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // placeholder="Enter your password"
              className={`passwordInput ${
                trackingError(fields.password) ? "error" : ""
              }`}
              onFocus={() => setPasswordIsFocused(true)}
              onBlur={() => setPasswordIsFocused(false)}
            />
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
