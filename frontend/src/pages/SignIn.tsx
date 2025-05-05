import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useLoginMutation, useMeQuery } from "../redux/services/api";
import { FormErrors, LoginDto } from "../types";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/services/authSlice";

export interface Error {
  data: {
    message: string;
  };
}
export const SignIn = () => {
  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const { data } = useMeQuery(undefined, {
    skip: !isSuccess,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<LoginDto>({
    username: "",
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

    // E-posta validasyonu

    // Şifre validasyonu
    if (!form.password) {
      newErrors.password = "Şifrə mütləqdir.";
    } else if (form.password.length < 6) {
      newErrors.password = "Şifrə ən az 6 simvol olmalıdır.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await login(form).unwrap();
        if (res) {
          dispatch(setToken(res));
        }
      } catch (err: unknown) {
        if (err && typeof err === "object" && "data" in err) {
          const myErr = err as Error;
          toast.error(myErr.data.message);
        }
      }
    }
  };

  useEffect(() => {
    if (isSuccess && !isLoading && data) {
      dispatch(setUser(data));
      console.log("success");
      navigate("/chat");
    }
  }, [isSuccess, data, isLoading]);

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
              to={"/"}
              className="border border-gray-300 py-2 px-2 rounded-xl"
            >
              Sign Up
            </NavLink>
          </div>
        </header>
        <div className=" w-1/3  flex-1 flex flex-col items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-center text-3xl font-bold mb-4">
              Welcome to Web Chat <br /> Sign In to getting started.
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            action=""
            className="w-9/12 flex flex-col gap-4"
          >
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
            <button
              type="submit"
              className="w-full bg-blue-700 rounded-xl text-white py-2 cursor-pointer mt-4"
            >
              {isLoading ? "Loading..." : "SignIn"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
