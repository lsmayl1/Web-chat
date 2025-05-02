import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useRegisterMutation } from "../redux/services/api";
import { FormErrors, RegisterDto } from "../types";

export interface Error {
  data: {
    message: string;
  };
}
export const SignUp = () => {
  const [register, { isLoading, isSuccess }] = useRegisterMutation();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [confirm_password, setConfirm_password] = useState("");
  const [form, setForm] = useState<RegisterDto>({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Kullanıcı adı validasyonu
    if (!form.username) {
      newErrors.username = "İstifadəçi adı mütləqdir.";
    } else if (form.username.length < 3) {
      newErrors.username = "İstifadəçi adı ən az 3 simvol olmalıdır.";
    }

    if (!form.first_name) {
      newErrors.first_name = "Ad mütləqdir.";
    } else if (form.first_name.length < 2) {
      newErrors.first_name = "Ad ən az 2 simvol olmalıdır.";
    }
    if (!form.last_name) {
      newErrors.last_name = "Soyad mütləqdir.";
    }

    // E-posta validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "E-poçt ünvanı mütləqdir";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Xahiş edirik, düzgün e-poçt ünvanı daxil edin.";
    }

    // Şifre validasyonu
    if (!form.password) {
      newErrors.password = "Şifrə mütləqdir.";
    } else if (form.password.length < 6) {
      newErrors.password = "Şifrə ən az 6 simvol olmalıdır.";
    }
    if (!confirm_password) {
      newErrors.confirm_password = "Şifrə təkrarı mütləqdir.";
    } else if (confirm_password !== form.password) {
      newErrors.confirm_password = "Şifrələr uyğun gəlmir.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await register(form).unwrap();
        navigate("/sign-in");
      } catch (err: unknown) {
        if (err && typeof err === "object" && "data" in err) {
          const myErr = err as Error;
          toast.error(myErr.data.message);
        }
      }
    }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex items-center  flex-col gap-16  ">
        <header className="flex w-full justify-between px-12 h-20 border-b border-gray-300 items-center">
          <div className="flex items-center justify-center">
            <div className="text-2xl font-semibold"> Web Chat</div>
          </div>
          <div>
            <NavLink
              to={"/sign-in"}
              className="border border-gray-300 py-2 px-2 rounded-xl"
            >
              Sign In
            </NavLink>
          </div>
        </header>
        <div className=" w-1/3  flex-1 flex flex-col items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-center text-3xl font-bold mb-4">
              Welcome to Web Chat <br /> Sign Up to getting started.
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            action=""
            className="w-9/12 flex flex-col gap-2"
          >
            <div className="flex gap-4">
              <div className="flex flex-col w-full">
                <label htmlFor="first_name" className="text-gray-700 ">
                  First name
                </label>
                <input
                  name="first_name"
                  onChange={onChange}
                  type="text"
                  placeholder="Enter your name"
                  className="border rounded-md border-gray-300 w-full px-2 py-2  focus:outline-blue-500"
                />
                {formErrors.first_name && (
                  <span style={{ color: "red" }}>{formErrors.first_name}</span>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="last_name" className="text-gray-700">
                  Last name
                </label>
                <input
                  name="last_name"
                  onChange={onChange}
                  type="text"
                  placeholder="Enter your name"
                  className="border rounded-md border-gray-300 w-full px-2 py-2 focus:outline-blue-500"
                />
                {formErrors.last_name && (
                  <span style={{ color: "red" }}>{formErrors.last_name}</span>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="username" className="text-gray-700">
                Username
              </label>
              <input
                name="username"
                onChange={onChange}
                type="text"
                placeholder="Enter your username"
                className="border rounded-md border-gray-300 w-full px-2 py-2 focus:outline-blue-500"
              />
              {formErrors.username && (
                <span style={{ color: "red" }}>{formErrors.username}</span>
              )}
            </div>
            <div>
              <label htmlFor="email" className="text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="text"
                onChange={onChange}
                placeholder="Enter your email "
                className="border rounded-md border-gray-300 w-full px-2 py-2 focus:outline-blue-500"
              />
              {formErrors.email && (
                <span style={{ color: "red" }}>{formErrors.email}</span>
              )}
            </div>
            <div>
              <label htmlFor="password" className="text-gray-700">
                Password
              </label>
              <input
                onChange={onChange}
                name="password"
                type="text"
                placeholder="Enter your password"
                className="border rounded-md border-gray-300 w-full px-2 py-2 focus:outline-blue-500"
              />
              {formErrors.password && (
                <span style={{ color: "red" }}>{formErrors.password}</span>
              )}
            </div>
            <div>
              <label htmlFor="confirm_password" className="text-gray-700">
                Confirm password
              </label>
              <input
                name="confirm_password"
                type="text"
                onChange={(e) => setConfirm_password(e.target.value)}
                placeholder="Confirm your password"
                className="border rounded-md border-gray-300 w-full px-2 py-2 focus:outline-blue-500"
              />
              {formErrors.confirm_password && (
                <span style={{ color: "red" }}>
                  {formErrors.confirm_password}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 rounded-xl text-white py-2 cursor-pointer mt-4"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
