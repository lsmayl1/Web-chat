import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useRegisterMutation } from "../redux/services/api";
import { RegisterDto } from "../types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { shema } from "../Schemas/schema";

export interface Error {
  data: {
    message: string;
  };
}
export const SignUp = () => {
  const [registerMutation, { isLoading, isSuccess }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(shema) });
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterDto) => {
    try {
      await registerMutation(data).unwrap();
      navigate("/sign-in");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const myErr = err as Error;
        toast.error(myErr.data.message);
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
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="w-9/12 flex flex-col gap-2"
          >
            <div className="flex gap-4">
              <div className="flex flex-col w-full">
                <label htmlFor="first_name" className="text-gray-700 ">
                  First name
                </label>
                <input
                  {...register("first_name")}
                  type="text"
                  placeholder="Enter your name"
                  className="border rounded-md border-gray-300 w-full px-2 py-2  focus:outline-blue-500"
                />
                <p>{errors.first_name?.message}</p>
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="last_name" className="text-gray-700">
                  Last name
                </label>
                <input
                  {...register("last_name")}
                  type="text"
                  placeholder="Enter your name"
                  className="border rounded-md border-gray-300 w-full px-2 py-2 focus:outline-blue-500"
                />
                <p>{errors.last_name?.message}</p>
              </div>
            </div>
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
              <label htmlFor="email" className="text-gray-700">
                Email
              </label>
              <input
                type="text"
                {...register("email")}
                placeholder="Enter your email "
                className="border rounded-md border-gray-300 w-full px-2 py-2 focus:outline-blue-500"
              />
              <p>{errors.email?.message}</p>
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
            <div>
              <label htmlFor="confirm_password" className="text-gray-700">
                Confirm password
              </label>
              <input
                type="text"
                {...register("confirm_password")}
                placeholder="Confirm your password"
                className="border rounded-md border-gray-300 w-full px-2 py-2 focus:outline-blue-500"
              />
              <p>{errors.confirm_password?.message}</p>
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
