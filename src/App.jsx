import React from "react";
import Drawer from "./components/Drawer";
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
const App = () => {
  return (
    <div className="relative min-h-screen">
      {/* 🔔 Toaster for notifications */}
      <ToastContainer />

      {/* Drawer overlays above content */}
      <div className="fixed top-0 left-0 z-50">
        <Drawer />
      </div>

      {/* Main content behind drawer */}
      <div className="flex flex-col w-full min-h-screen">
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tailors" element={<TailorPost />} />
          <Route path="/tailorprofile/:id" element={<TailorProfile />} />
          <Route path="/customerprofile/:id" element={<CustomerProfile />} />
          <Route path="/cloths/:clothId" element={<ClothPage />} />
          <Route path="/measurement" element={<Measurement />} />




          {/* Private Route */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
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
            path="/pallete"
            element={
              <PrivateRoute>
                <PalletePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/addpost"
            element={
              <PrivateRoute>
                <AddPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/custom"
            element={
              <PrivateRoute>
                <Customize />
              </PrivateRoute>
            }
          />
          <Route
            path="/tailorcustom"
            element={
              <PrivateRoute>
                <CustomOrder />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

// Export wrapped with CookiesProvider
export default () => (
  <CookiesProvider>
    <App />
  </CookiesProvider>
);
