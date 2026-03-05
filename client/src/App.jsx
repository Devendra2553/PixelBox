import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserRegister from "./component/UserRegister";
import UserLogin from "./component/UserLogin";
import Home from "./component/Home";
import ArtistLogin from "./component/ArtistComponents/ArtistLogin";
import ArtistRegister from "./component/ArtistComponents/ArtistRegister";
import ArtistPanel from "./component/ArtistComponents/ArtistPanel";
import Dashboard from "./component/ArtistComponents/PanelComponents/Dashboard";
import Profile from "./component/ArtistComponents/PanelComponents/Profile";
import Artwork from "./component/ArtistComponents/PanelComponents/Artwork";
import Order from "./component/ArtistComponents/PanelComponents/Order";
import Cart from "./component/Cart";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRegister />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/artistregister" element={<ArtistRegister />} />
        <Route path="/home" element={<Home />} />
        <Route path="/artistlogin" element={<ArtistLogin />} />

        <Route
          path="/artistpanel"
          element={
            <ProtectedRoute role="artist">
              <ArtistPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="artwork" element={<Artwork />} />
          <Route path="order" element={<Order />} />
        </Route>

        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
