import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
// import ProductsPage from './pages/ProductsPage';
// import CartPage from './pages/CartPage';
// import LoginPage from './pages/LoginPage';
// import AccountPage from './pages/AccountPage';
// import RegisterPage from './pages/RegisterPage';
// import PrinterDetailPage from './pages/PrinterDetailPage';

const AppRouter = ({ isLoggedIn }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<PrinterDetailPage />} />
      <Route
        path="/cart"
        element={isLoggedIn ? <CartPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/account"
        element={isLoggedIn ? <AccountPage /> : <Navigate to="/login" replace />}
      /> */}
    </Routes>
  );
};

export default AppRouter;
