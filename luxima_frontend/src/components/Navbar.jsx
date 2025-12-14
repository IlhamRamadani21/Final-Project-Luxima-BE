import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; // Pastikan path ini benar sesuai struktur folder Anda
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
    // Ambil data auth dari LocalStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };
    
    const navigate = useNavigate();
    const { cart, clearCart } = useCart(); 

    // State untuk Search
    const [keyword, setKeyword] = useState('');

    const handleLogout = () => {
        // Hapus semua data auth
        clearCart();
        localStorage.clear();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Redirect ke Home dengan query parameter
        navigate(`/?search=${keyword}`);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return alert("Keranjang kosong!");
        const total = cart.reduce((sum, item) => sum + item.harga, 0);

        try {
            const response = await api.post('/checkout', {
                items: cart,
                total_harga: total
            });
            alert(`Pesanan Berhasil! ID Transaksi: ${response.data.order_id}`);
            clearCart();
        } catch (error) {
            console.error(error);
            alert("Checkout Gagal.");
        }
    };

    return (
        <>
            {/* 1. TOP HEADER */}
            <header className="text-white py-2 shadow-sm" style={{ background: 'linear-gradient(90deg, #5D7B93 0%, #8FA3B5 100%)' }}>
                <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
                    {/* Logo */}
                    <Link to="/" className="fw-bold fs-3 text-white text-decoration-none">Luxima</Link>
                    
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="input-group d-none d-md-flex" style={{maxWidth: '600px', width: '100%'}}>
                        <input 
                            type="text" 
                            className="form-control border-0 py-2" 
                            placeholder="Cari Judul, Penulis, atau ISBN..." 
                            style={{borderRadius: '4px 0 0 4px'}}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button className="btn btn-light bg-white border-0" type="submit" style={{borderRadius: '0 4px 4px 0'}}>
                            <span style={{color: '#5D7B93', fontWeight: 'bold'}}>🔍</span>
                        </button>
                    </form>

                    <div className="d-flex align-items-center gap-4">
                        {/* Logic Keranjang */}
                        {token && (
                            <div className="dropdown">
                                <button className="btn btn-sm text-white d-flex align-items-center gap-1 border-0 bg-transparent" type="button" data-bs-toggle="dropdown">
                                    <div className="position-relative" style={{cursor: 'pointer'}}>
                                        <span style={{fontSize: '1.4rem'}}><Link to="/keranjang">🛍️</Link></span>
                                        {cart.length > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{fontSize: '0.7rem'}}>
                                                {cart.length}
                                            </span>
                                        )}
                                    </div>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-3" style={{minWidth: '280px'}}>
                                    <li><h6 className="dropdown-header text-uppercase fw-bold">Keranjang Belanja</h6></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    {cart.length === 0 ? (
                                        <li><span className="dropdown-item text-muted small text-center py-3">Keranjang Kosong</span></li>
                                    ) : (
                                        <>
                                            <li className="d-flex justify-content-between px-3 py-1 small">
                                                <span>Total Item:</span>
                                                <span className="fw-bold">{cart.length}</span>
                                            </li>
                                            <li className="d-flex justify-content-between px-3 py-1 small mb-3">
                                                <span>Total Harga:</span>
                                                <span className="fw-bold text-success">Rp {cart.reduce((a,b)=>a+b.harga, 0).toLocaleString()}</span>
                                            </li>
                                            <li>
                                                <button onClick={handleCheckout} className="btn btn-success btn-sm w-100 fw-bold">
                                                    Checkout Sekarang
                                                </button>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Logic Login/Logout */}
                        {token ? (
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold text-white fs-6">Hi, {user.name}</span>
                                <button 
                                    onClick={handleLogout} 
                                    className="btn btn-outline-light btn-sm px-3 py-1 fw-bold" 
                                    style={{borderRadius: '6px', borderWidth: '1.5px'}}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/login" className="btn btn-sm btn-light fw-bold">Login</Link>
                                <span className="text-white opacity-50 align-self-center">|</span>
                                <Link to="/register" className="text-white fw-bold text-decoration-none" style={{cursor:'pointer'}}>Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 2. NAVIGATION */}
            <nav className="bg-white shadow-sm py-3 sticky-top" style={{zIndex: 100}}>
                <div className="container-fluid px-4">
                    <ul className="nav justify-content-center gap-5 fw-bold text-secondary fs-6">
                        <li className="nav-item">
                            <Link to="/" className="nav-link text-dark p-0 hover-underline">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/kategori" className="nav-link text-secondary p-0 hover-underline">Kategori</Link>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link text-secondary p-0 hover-underline" style={{cursor:'pointer'}}>Best seller</span>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className="nav-link text-secondary p-0 hover-underline">About Us</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;