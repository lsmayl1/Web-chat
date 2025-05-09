import { Route, Routes } from "react-router-dom";
import { SignUp } from "./pages/SignUp.tsx";
import { SignIn } from "./pages/SignIn.tsx";
import { PrivateRoute } from "./Routes/PrivateRoute.tsx";
import { useSelector } from "react-redux";
import { useMeQuery } from "./redux/services/api.ts";
import { AuthRoute } from "./Routes/AuthRoute.tsx";
import { Layout } from "./components/Layout/Layout.tsx";
import { RootState } from "./redux/store.ts";
import { ChatList } from "./components/Chat/ChatList.tsx";
import { Chat } from "./components/Chat/Chat.tsx";
function App() {
  const { access_token } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useMeQuery(undefined, {
    skip: !access_token,
  });

  if (isLoading && access_token) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AuthRoute />}>
        <Route path="/" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["Admin", "user"]} />}>
        <Route element={<Layout />}>
          <Route path="/chat" element={<Chat />}>
            <Route path=":id" element={<ChatList />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
