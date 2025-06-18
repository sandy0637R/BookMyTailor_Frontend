import React from "react";
import Drawer from "./components/Drawer";
import { Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tailors from "./pages/Tailors";
import Profile from "./pages/Profile";
import PalletePage from "./pages/PalletePage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./utils/PrivateRoute";
import ToastContainer from "./containers/ToastContainer";
import AddPost from "./pages/AddPost";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";

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
          <Route path="/tailors" element={<Tailors />} />

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
