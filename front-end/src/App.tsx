import Login from "./pages/loginPage";
import Register from "./pages/registerPage";
import Home from "./pages/home";
import { Route, Routes } from "react-router-dom";
import UserProfile from "./pages/userProfile";
import ProtectedRoute from "./components/ProtectedRoute";
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
    </Routes>
  );
}

export default App;
