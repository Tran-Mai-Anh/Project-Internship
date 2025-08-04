import React, { useState } from "react";
import RegisterCar from "./RegisterCar";
import RegisterAccount from "./RegisterAccount";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    imei: "",
    licensePlate: "",
    simPhoneNumber: "",
    brand: "",
    vehicleType: "",
  });

  const handleNext = (carData: any) => {
    setFormData((prev) => ({ ...prev, ...carData }));
    setStep(2);
  };
  const navigate = useNavigate();
  const handleRegister = async (accountData: any) => {
    const finalData = { ...formData, ...accountData };

    try {
      const response = await axiosInstance.post("/auth/register", finalData);
      navigate("/login");
      alert("Đăng ký thành công!");
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error.response?.data || error.message);
      alert("Đăng ký thất bại");
    }
  };

  return (
    <div>
      {step === 1 ? (
        <RegisterCar onNext={handleNext} defaultData={formData} />
      ) : (
        <RegisterAccount onRegister={handleRegister} defaultData={formData} />
      )}
    </div>
  );
};

export default Register;
