import Login from "./pages/loginPage";
import Register from "./pages/registerPage";
import Home from "./pages/home";
import { Route, Routes } from "react-router-dom";
import UserProfile from "./pages/userProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdressPage from "./pages/adressPage";
import AdressRegisterPage from "./pages/adressPageRegister";
import RegisterProducts from "./pages/registerProducts";
import FavoritePage from "./pages/favoritesPage";
import OrdersPage from "./pages/ordersPage";
import AdminPage from "./pages/Admin/adminPage,";
import RegisteredProducts from "./pages/Admin/registeredProducts";
import ProductPage from "./pages/Admin/productPage";
import SearchUserPage from "./pages/Admin/searchUser";
import OrdersPageAdmin from "./pages/Admin/ordersPageAdmin";
import OrderSinglePage from "./pages/Admin/orderSinglePage";
//preciso dar um jeito de proteger a rota de registrar produtos,
//talvez por um token diferente? adicionar o campo isAdmin na table user também
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      <Route
        path="/register-products"
        element={<RegisterProducts></RegisterProducts>}
      ></Route>
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
      <Route
        path="/favorite-page"
        element={
          <ProtectedRoute>
            <FavoritePage></FavoritePage>
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/orders-page"
        element={
          <ProtectedRoute>
            <OrdersPage></OrdersPage>
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminPage></AdminPage>
          </AdminProtectedRoute>
        }
      ></Route>
      <Route
        path="/registered-products"
        element={
          <AdminProtectedRoute>
            <RegisteredProducts></RegisteredProducts>
          </AdminProtectedRoute>
        }
      ></Route>
      <Route
        path="/edit-product/:id"
        element={
          <AdminProtectedRoute>
            <ProductPage></ProductPage>
          </AdminProtectedRoute>
        }
      ></Route>
      <Route
        path="/search-user"
        element={
          <AdminProtectedRoute>
            <SearchUserPage></SearchUserPage>
          </AdminProtectedRoute>
        }
      ></Route>
      <Route
        path="/admin-orders-page"
        element={
          <AdminProtectedRoute>
            <OrdersPageAdmin></OrdersPageAdmin>
          </AdminProtectedRoute>
        }
      ></Route>
      <Route
        path="/admin/orders/:id"
        element={
          <AdminProtectedRoute>
            <OrderSinglePage></OrderSinglePage>
          </AdminProtectedRoute>
        }
      ></Route>
    </Routes>
  );
}

export default App;
