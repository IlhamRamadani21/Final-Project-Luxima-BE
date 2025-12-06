import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    // Simulasi data user/cart (ideally pakai Context/Redux)
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <>
            <header className="text-white py-2" style={{ background: 'linear-gradient(90deg, #5D7B93 0%, #8FA3B5 100%)' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="fw-bold fs-4">Luxima</div>
                    <div className="input-group w-50 d-none d-md-flex">
                        <input type="text" className="form-control border-0" placeholder="Search..." />
                        <button className="btn btn-light" type="button">🔍</button>
                    </div>
                    <div className="d-flex align-items-center gap-3 small">
                        {token ? (
                            <div className="d-flex align-items-center gap-2">
                                <span className="fw-bold">Hi, {user.name}</span>
                                <button onClick={handleLogout} className="btn btn-sm btn-outline-light py-0">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-white text-decoration-none fw-bold">Login</Link>
                        )}
                    </div>
                </div>
            </header>
            <nav className="bg-white shadow-sm py-3 sticky-top" style={{zIndex: 100}}>
                <div className="container">
                    <ul className="nav justify-content-center gap-4 fw-bold text-secondary">
                        <li className="nav-item"><Link to="/" className="nav-link text-dark p-0">Home</Link></li>
                        <li className="nav-item"><Link to="/kategori" className="nav-link text-secondary p-0">Kategori</Link></li>
                        <li className="nav-item"><Link to="/about" className="nav-link text-secondary p-0">About Us</Link></li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;