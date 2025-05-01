import { Route, Routes } from "react-router-dom";
import { SignUp } from "./pages/SignUp.tsx";
import { SignIn } from "./pages/SignIn.tsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
  );
}

export default App;
