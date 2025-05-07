import { Route, Routes } from "react-router-dom";
import { SignUp } from "./pages/SignUp.tsx";
import { SignIn } from "./pages/SignIn.tsx";
import { PrivateRoute } from "./Routes/PrivateRoute.tsx";
import { Chat } from "./components/Chat/Chat.tsx";
import { useDispatch, useSelector } from "react-redux";
import { useMeQuery } from "./redux/services/api.ts";
import { useEffect } from "react";
import { setUser } from "./redux/services/authSlice.ts";
import { AuthRoute } from "./Routes/AuthRoute.tsx";
import { Layout } from "./components/Layout/Layout.tsx";
import { RootState } from "./redux/store.ts";
function App() {
  const { access_token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { data, isLoading, isSuccess } = useMeQuery(undefined, {
    skip: !access_token,
  });

  useEffect(() => {
    if (data && isSuccess && !isLoading) {
      dispatch(setUser(data));
    }
  }, [data, isLoading, isSuccess, dispatch]);

  return (
    <Routes>
      <Route element={<AuthRoute />}>
        <Route path="/" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["Admin", "user"]} />}>
        <Route element={<Layout />}>
          <Route path="/chat" element={<Chat />}>
            <Route path=":id" element={<Chat />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
