import Login from "./pages/loginPage";
import Register from "./pages/registerPage";
import Home from "./pages/home";
import { Route, Routes } from "react-router-dom";
import UserProfile from "./pages/userProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdressPage from "./pages/adressPage";
import AdressRegisterPage from "./pages/adressPageRegister";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      <Route
        path="/user-profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/adress-user"
        element={
          <ProtectedRoute>
            <AdressPage></AdressPage>
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/adress-register"
        element={
          <ProtectedRoute>
            <AdressRegisterPage></AdressRegisterPage>
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  );
}

export default App;
