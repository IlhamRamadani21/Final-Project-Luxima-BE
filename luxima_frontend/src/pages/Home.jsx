import React, { useEffect, useState } from 'react';
import api from '../api'; 
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    // --- STATE & LOGIC ---
    const [books, setBooks] = useState([]);
    const [cart, setCart] = useState([]); 
    const navigate = useNavigate();

    // Ambil data user dari LocalStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };
    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data.data || []); 
        } catch (error) {
            console.error("Gagal ambil buku:", error);
        }
    };

    // Fetch Data Buku saat pertama kali load
    useEffect(() => {
        fetchBooks();
    }, []);


    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const addToCart = (book) => {
        if (!token) {
            alert("Eits, Login dulu sebelum belanja!");
            return navigate('/login');
        }
        setCart([...cart, book]);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return alert("Keranjang kosong!");
        const total = cart.reduce((sum, item) => sum + item.price, 0);

        try {
            const response = await api.post('/checkout', {
                items: cart,
                total_price: total
            });
            alert(`Pesanan Berhasil! ID Transaksi: ${response.data.order_id}`);
            setCart([]); 
        } catch (error) {
            console.error(error);
            alert("Checkout Gagal. Pastikan Backend sudah siap.");
        }
    };

    // Helper warna placeholder
    const getPlaceholderColor = (index) => {
        const colors = ['#FF0000', '#FFC09F', '#2D6A4F', '#D3D3D3', '#A69090'];
        return colors[index % colors.length];
    };

    // --- RENDER TAMPILAN ---
    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
            
            {/* 1. TOP HEADER (container-fluid px-4) */}
            <header className="text-white py-2 shadow-sm" style={{ background: 'linear-gradient(90deg, #5D7B93 0%, #8FA3B5 100%)' }}>
                <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
                    <div className="fw-bold fs-3 text-white">Luxima</div>
                    
                    {/* Search Bar */}
                    <div className="input-group d-none d-md-flex" style={{maxWidth: '600px', width: '100%'}}>
                        <input type="text" className="form-control border-0 py-2" placeholder="Search..." style={{borderRadius: '4px 0 0 4px'}} />
                        <button className="btn btn-light bg-white border-0" type="button" style={{borderRadius: '0 4px 4px 0'}}>
                            <span style={{color: '#5D7B93', fontWeight: 'bold'}}>🔍</span>
                        </button>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                        {/* Logic Keranjang */}
                        {token && (
                            <div className="dropdown">
                                <button className="btn btn-sm text-white d-flex align-items-center gap-1 border-0 bg-transparent" type="button" data-bs-toggle="dropdown">
                                    <div className="position-relative" style={{cursor: 'pointer'}}>
                                        <span style={{fontSize: '1.4rem'}}>🛍️</span>
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{fontSize: '0.7rem'}}>
                                            {cart.length}
                                        </span>
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
                                                <span className="fw-bold text-success">Rp {cart.reduce((a,b)=>a+b.price, 0).toLocaleString()}</span>
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
                                <span className="text-white fw-bold" style={{cursor:'pointer'}}>Sign Up</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 2. NAVIGATION (container-fluid px-4) */}
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

            {/* 3. KONTEN UTAMA (container-fluid px-4) */}
            <div className="container-fluid px-4 my-5">
                {/* HERO SECTION */}
                <section className="py-4">
                    <div className="row align-items-center">
                        <div className="col-md-6 ps-lg-5">
                            <h6 className="text-uppercase text-muted ls-1 small fw-bold">Books on Wellbeing</h6>
                            <h1 className="display-4 fw-bold mb-3 text-dark">Temukan kisah inspiratif dalam novel "Langit Senja".</h1>
                            <p className="text-secondary mb-4 fs-5">Perjalanan cinta dan harapan yang lahir di balik luka masa lalu.</p>
                            <button className="btn text-white px-5 py-2 shadow-sm rounded-pill" style={{ backgroundColor: '#5D7B93' }}>Show all</button>
                            
                            <div className="d-flex gap-2 mt-5">
                                <span style={{width: 30, height: 4, background: '#5D7B93', borderRadius:2}}></span>
                                <span style={{width: 30, height: 4, background: '#ddd', borderRadius:2}}></span>
                                <span style={{width: 30, height: 4, background: '#ddd', borderRadius:2}}></span>
                            </div>
                        </div>
                        <div className="col-md-6 position-relative d-flex justify-content-center mt-5 mt-md-0" style={{minHeight:'400px'}}>
                            <div className="shadow" style={{ width: 260, height: 340, background: '#D90429', position: 'absolute', right: '35%', top: '5%', zIndex: 1, borderRadius: '8px' }}></div>
                            <div className="shadow" style={{ width: 240, height: 320, background: '#FFC09F', position: 'absolute', right: '20%', top: '20%', zIndex: 2, borderRadius: '8px' }}></div>
                        </div>
                    </div>
                </section>

                <hr style={{ borderTop: '4px solid #f1f1f1', margin: '3rem 0' }} />

                {/* DYNAMIC BOOK GRID */}
                <div className="d-flex justify-content-between align-items-end mb-4 px-lg-2">
                    <h5 className="fw-bold text-uppercase text-dark m-0 fs-4">Eksplor Bestsellers</h5>
                    <Link to="/kategori" className="text-muted small text-decoration-none fw-bold">View more &gt;</Link>
                </div>

                <div className="row g-4 mb-5">
                    {/* Placeholder Statis (Visual Only) */}
                    {books.length === 0 && (
                        <>
                            <div className="col-md-6 col-lg-3">
                                <div className="rounded shadow-sm" style={{height: '200px', backgroundColor: '#D90429'}}></div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="rounded shadow-sm" style={{height: '200px', backgroundColor: '#FFC09F'}}></div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="rounded shadow-sm" style={{height: '200px', backgroundColor: '#2D6A4F'}}></div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="rounded shadow-sm" style={{height: '200px', backgroundColor: '#D3D3D3'}}></div>
                            </div>
                        </>
                    )}

                    {/* Data Buku Asli */}
                    {books.length > 0 && books.map((book, index) => (
                        <div className="col-md-6 col-lg-3 col-xl-3" key={book.id || index}>
                            <div className="card h-100 border-0 bg-transparent hover-lift">
                                <div 
                                    className="rounded shadow-sm mb-3 d-flex align-items-center justify-content-center text-white position-relative overflow-hidden" 
                                    style={{ height: '280px', backgroundColor: getPlaceholderColor(index), cursor: 'pointer' }}
                                >
                                    <span className="fs-1 opacity-50">📖</span>
                                </div>
                                
                                <div className="card-body p-0">
                                    <div className="text-muted small mb-1 text-uppercase fw-bold" style={{fontSize: '11px', letterSpacing: '0.5px'}}>
                                        {book.author?.nama || 'Unknown Author'}
                                    </div>
                                    <h6 className="card-title fw-bold text-dark text-truncate mb-2" title={book.title}>
                                        {book.title}
                                    </h6>
                                    <div className="d-flex justify-content-between align-items-center border-top pt-2">
                                        <span className="fw-bold text-dark">
                                            Rp {book.price ? book.price.toLocaleString() : '0'}
                                        </span>
                                        <button 
                                            onClick={() => addToCart(book)} 
                                            className="btn btn-link text-decoration-none p-0 small fw-bold" 
                                            style={{color: '#3498db', fontSize: '13px'}}
                                        >
                                            Add to cart 🛒
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. FOOTER (container-fluid px-4) */}
            <footer className="text-white pt-5 pb-4 mt-auto" style={{ backgroundColor: '#1a252f' }}>
                <div className="container-fluid px-4">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <h5 className="fw-bold mb-3">Luxima</h5>
                            <p className="small text-secondary lh-lg">
                                Toko buku online terlengkap dengan pengalaman belanja yang nyaman.
                            </p>
                        </div>
                        <div className="col-md-4">
                            <h5 className="fw-bold mb-3">Info Perusahaan</h5>
                            <ul className="list-unstyled small text-secondary lh-lg">
                                <li>🏠 Jl. Jaha Gg. Mujahidin No.25, RT.9/RW.1, Kalisari, Kec. Ps. Rebo, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13790</li>
                                <li>Jakarta, Indonesia</li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h5 className="fw-bold mb-3">Payment Method</h5>
                            <p className="small text-secondary">DANA, OVO, Bank Transfer</p>
                        </div>
                    </div>
                    <div className="text-center mt-5 pt-3 border-top border-secondary small text-secondary">
                        &copy; © 2025 Luxima Bookstore. All rights reserved.
                    </div>
                </div>
            </footer>

            <style>
                {`
                .hover-underline:hover {
                    color: #5D7B93 !important;
                    text-decoration: underline;
                }
                .hover-lift {
                    transition: transform 0.2s;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                }
                `}
            </style>
        </div>
    );
}

export default Home;