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
import PaymentSuccess from "./component/PaymentSuccess";
import ProtectedRoute from "./ProtectedRoute";
import AdminLogin from "./component/AdminComponents/AdminLogin";
import AdminPanel from "./component/AdminComponents/AdminPanel";
import AdminDashboard from "./component/AdminComponents/PanelComponents/AdminDashboard";
import AdminArtworks from "./component/AdminComponents/PanelComponents/AdminArtworks";
import AdminOrders from "./component/AdminComponents/PanelComponents/AdminOrders";
import AdminUsers from "./component/AdminComponents/PanelComponents/AdminUsers";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/userregister" element={<UserRegister />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/paymentSuccess" element={<PaymentSuccess />} />

        <Route path="/artistlogin" element={<ArtistLogin />} />
        <Route path="/artistregister" element={<ArtistRegister />} />

        <Route
          path="/artistpanel"
          element={
            <ProtectedRoute role="artist" redirectTo="/artistlogin">
              <ArtistPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="artwork" element={<Artwork />} />
          <Route path="order" element={<Order />} />
        </Route>

        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route
          path="/adminpanel"
          element={
            <ProtectedRoute role="admin" redirectTo="/adminlogin">
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="admindashboard" replace />} />
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="adminartworks" element={<AdminArtworks />} />
          <Route path="adminorders" element={<AdminOrders />} />
          <Route path="adminusers" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
