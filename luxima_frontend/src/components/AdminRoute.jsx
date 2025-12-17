import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // Cek Token dan Role
    if (token && user && user.role === 'admin') {
        return <Outlet />;
    }

    // Jika bukan admin, navigate ke Home
    return <Navigate to="/" replace />;
};

export default AdminRoute;