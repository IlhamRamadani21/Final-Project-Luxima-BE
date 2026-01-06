import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');

    // Jika token ada, izinkan akses ke halaman di dalamnya (Outlet)
    // Jika tidak, arahkan ke halaman login
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;