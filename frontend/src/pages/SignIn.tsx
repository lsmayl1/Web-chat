import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useLoginMutation, useMeQuery } from "../redux/services/api";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/services/authSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { shema } from "../Schemas/schema";

const loginShema = shema.pick(["username", "password"]);

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginShema) });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      if (res) {
        dispatch(setToken(res));
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const myErr = err as Error;
        toast.error(myErr.data.message);
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
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="w-9/12 flex flex-col gap-4"
          >
            <div>
              <label htmlFor="username" className="text-gray-700">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="Enter your username"
                className="border rounded-md border-gray-300 w-full px-2 py-2 focus:outline-blue-500"
              />
              <p>{errors.username?.message}</p>
            </div>
            <div>
              <label htmlFor="password" className="text-gray-700">
                Password
              </label>
              <input
                {...register("password")}
                name="password"
                type="text"
                placeholder="Enter your password"
                className="border rounded-md border-gray-300 w-full px-2 py-2 focus:outline-blue-500"
              />
              <p>{errors.password?.message}</p>
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
