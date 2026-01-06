import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart'; 

const Navbar = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };
    
    const navigate = useNavigate();
    
    // Hook useCart agar data realtime dari DB
    const { cart, cartCount, clearCartLocal, refreshCart } = useCart(); 

    const [keyword, setKeyword] = useState('');

    // Refresh cart saat komponen dimuat (untuk sinkronisasi awal)
    useEffect(() => {
        if(token) refreshCart();
    }, [token, refreshCart]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearCartLocal(); // Bersihkan state lokal
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/kategori?search=${keyword}`);
    };

    // Hitung total harga untuk preview dropdown
    const dropdownTotal = cart.reduce((total, item) => {
        const harga = item.book?.harga || 0;
        return total + (harga * item.quantity);
    }, 0);

    return (
        <>
            {/* TOP HEADER */}
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
                                <button 
                                    className="btn btn-sm text-white d-flex align-items-center gap-1 border-0 bg-transparent" 
                                    type="button" 
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div className="position-relative" style={{cursor: 'pointer'}}>
                                        <span style={{fontSize: '1.4rem'}}>🛍️</span>
                                        {cartCount > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{fontSize: '0.7rem'}}>
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-3" style={{minWidth: '320px'}}>
                                    <li><h6 className="dropdown-header text-uppercase fw-bold">Keranjang Belanja</h6></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    
                                    {cart.length === 0 ? (
                                        <li><div className="dropdown-item text-muted small text-center py-3">Keranjang Kosong</div></li>
                                    ) : (
                                        <>
                                            {/* Preview 3 Item Teratas */}
                                            {cart.slice(0, 3).map((item) => (
                                                <li key={item.id} className="d-flex justify-content-between px-3 py-2 small border-bottom align-items-center">
                                                    <div className="text-truncate" style={{maxWidth: '180px'}}>
                                                        <span className="fw-bold d-block text-truncate">{item.book?.judul}</span>
                                                        <span className="text-muted">{item.quantity} x Rp {Number(item.book?.harga).toLocaleString('id-ID')}</span>
                                                    </div>
                                                    <img 
                                                        src={item.book?.cover_buku ? `http://127.0.0.1:8000/storage/${item.book.cover_buku}` : 'https://via.placeholder.com/30'} 
                                                        alt="cover" 
                                                        style={{width: '30px', height: '45px', objectFit:'cover'}}
                                                        className="rounded"
                                                    />
                                                </li>
                                            ))}
                                            
                                            {cart.length > 3 && (
                                                <li className="text-center py-1 small text-muted">...dan {cart.length - 3} barang lainnya</li>
                                            )}

                                            <li className="d-flex justify-content-between px-3 py-3 small mt-2">
                                                <span>Total Estimasi:</span>
                                                <span className="fw-bold text-success fs-6">Rp {dropdownTotal.toLocaleString('id-ID')}</span>
                                            </li>
                                            <li>
                                                <Link to="/keranjang" className="btn btn-primary btn-sm w-100 fw-bold">
                                                    Lihat Keranjang & Checkout
                                                </Link>
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

            {/* NAVIGATION */}
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
                        {token && (
                            <li className="nav-item">
                                <Link to="/orders" className="nav-link text-primary p-0 hover-underline">Pesanan Saya</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;