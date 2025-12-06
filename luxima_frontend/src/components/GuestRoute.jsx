import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute = () => {
    // 1. Cek apakah ada token di localStorage
    const token = localStorage.getItem('token');

    // 2. Jika token ADA, redirect paksa ke halaman Home ('/')
    if (token) {
        return <Navigate to="/" replace />;
    }

    // 3. Jika token TIDAK ADA, render halaman yang diminta (Login/Register)
    return <Outlet />;
};

export default GuestRoute;