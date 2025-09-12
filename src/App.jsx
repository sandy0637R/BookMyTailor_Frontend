import React from "react";
import { Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TailorPost from "./pages/TailorPost";
import Profile from "./pages/Profile";
import PalletePage from "./pages/PalletePage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./utils/PrivateRoute";
import ToastContainer from "./containers/ToastContainer";
import AddPost from "./pages/AddPost";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Customize from "./pages/Customize";
import CustomOrder from "./pages/CustomOrder";
import TailorProfile from "./components/TailorProfile";
import CustomerProfile from "./pages/CustomerProfile";
import ClothPage from "./pages/ClothPage";
import Measurement from "./pages/Measurement";
import ChatPage from "./pages/ChatPage";
import ClothHandeling from "./pages/ClothHandeling";
import RoleRoute from "./utils/RoleRoute";
import Admin from "./pages/Admin";
import MyOrders from "./pages/MyOrder";
import { ModalProvider } from "./components/ModalProvider";

const App = () => {
  return (
    <div className="relative min-h-screen">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tailors" element={<TailorPost />} />
        <Route path="/tailorprofile/:id" element={<TailorProfile />} />
        <Route path="/customerprofile/:id" element={<CustomerProfile />} />
        <Route path="/cloths/:clothId" element={<ClothPage />} />
        <Route path="/pallete" element={<PalletePage />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/measurement"
          element={
            <PrivateRoute>
              <Measurement />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:userId"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          }
        />
        <Route
          path="/addpost"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["tailor"]}>
                <AddPost />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/cloth"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["tailor"]}>
                <ClothHandeling />
              </RoleRoute>
            </PrivateRoute>
          }
        />
         <Route
          path="/admin"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <Admin />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/custom"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["customer"]}>
                <Customize />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/tailorcustom"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["tailor"]}>
                <CustomOrder />
              </RoleRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default () => (
  <CookiesProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
  </CookiesProvider>
);
