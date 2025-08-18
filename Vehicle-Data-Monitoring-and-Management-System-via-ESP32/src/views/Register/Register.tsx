/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import RegisterCar from "./RegisterCar";
import RegisterAccount from "./RegisterAccount";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { useBackDrop } from "../Backdrop/BackdropProvider";
import { toast } from "react-toastify";
import axios from "axios";

interface FieldError {
  Field: string;
  Error: string;
}

const Register = () => {
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    imei: "",
    licensePlate: "",
    simPhoneNumber: "",
    brand: "",
    vehicleType: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  const handleNext = (carData: any) => {
    setFormData((prev) => ({ ...prev, ...carData }));
    setStep(2);
  };
  const { showBackDrop, hideBackDrop } = useBackDrop();
  const navigate = useNavigate();
  const handleRegister = async (accountData: any) => {
    const finalData = { ...formData, ...accountData };

    try {
      showBackDrop();
      const response = await axiosInstance.post("/auth/register", finalData);
      navigate("/login");
      toast.success("Đăng ký thành công!");
    } catch (error: any) {
      console.log(error);
      console.error("Lỗi đăng ký:", error.response?.data || error.message);
      if (axios.isAxiosError(error)) {
        const dataError = error?.response?.data;
        if (dataError.message.includes("Validation failed")) {
          setFieldErrors(dataError.errors);
        }
      } else {
        if (error.message.includes("Validation failed")) {
          setFieldErrors(error?.errors);
        }
        toast.error(error.message);
      }
    } finally {
      hideBackDrop();
    }
  };

  return (
    <div>
      {step === 1 ? (
        <RegisterCar
          onNext={handleNext}
          defaultData={formData}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
        />
      ) : (
        <RegisterAccount
          onRegister={handleRegister}
          defaultData={formData}
          fieldErrors={fieldErrors}
        />
      )}
    </div>
  );
};

export default Register;
