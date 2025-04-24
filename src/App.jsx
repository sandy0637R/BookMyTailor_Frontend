import Drawer from "./components/Drawer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tailors from "./pages/Tailors";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  return(

    <div className="relative min-h-screen">
    {/* Drawer overlays above content */}
    <div className="fixed top-0 left-0 z-50">
      <Drawer />
    </div>

    {/* Full-screen main content behind drawer */}
    <div className="flex flex-col w-full min-h-screen ">
    <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tailors" element={<Tailors />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  </div>
  );
}

export default App;
