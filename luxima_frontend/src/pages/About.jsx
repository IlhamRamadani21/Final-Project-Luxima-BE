import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={{backgroundColor: '#f9f9f9', fontFamily: 'Segoe UI, sans-serif'}}>
             
             {/* HEADER FULL WIDTH */}
             <header className="text-white py-2 shadow-sm" style={{ background: 'linear-gradient(90deg, #5D7B93 0%, #8FA3B5 100%)' }}>
                <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
                    <div className="fw-bold fs-3 text-white">Luxima</div>
                    
                    <div className="input-group d-none d-md-flex" style={{maxWidth: '600px', width: '100%'}}>
                        <input type="text" className="form-control border-0 py-2" placeholder="Search..." style={{borderRadius: '4px 0 0 4px'}} />
                        <button className="btn btn-light bg-white border-0" type="button" style={{borderRadius: '0 4px 4px 0'}}>
                            <span style={{color: '#5D7B93', fontWeight: 'bold'}}>🔍</span>
                        </button>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                        <div className="position-relative" style={{cursor: 'pointer'}}>
                            <span style={{fontSize: '1.4rem'}}>🛍️</span>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{fontSize: '0.7rem'}}>
                                0
                            </span>
                        </div>

                        {token ? (
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold text-white fs-6">Hi, {user.name}</span>
                                <button onClick={handleLogout} className="btn btn-outline-light btn-sm px-3 py-1 fw-bold" style={{borderRadius: '6px', borderWidth: '1.5px'}}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-sm btn-light fw-bold">Login</Link>
                        )}
                    </div>
                </div>
            </header>

            {/* NAVBAR FULL WIDTH */}
            <nav className="bg-white shadow-sm py-3 sticky-top" style={{zIndex: 100}}>
                <div className="container-fluid">
                    <ul className="nav justify-content-center gap-5 fw-bold text-secondary fs-6">
                        <li className="nav-item"><Link to="/" className="nav-link text-secondary p-0">Home</Link></li>
                        <li className="nav-item"><Link to="/kategori" className="nav-link text-secondary p-0">Kategori</Link></li>
                        <li className="nav-item"><span className="nav-link text-secondary p-0" style={{cursor:'pointer'}}>Best seller</span></li>
                        <li className="nav-item"><Link to="/about" className="nav-link text-dark p-0">About Us</Link></li>
                    </ul>
                </div>
            </nav>

            {/* KONTEN UTAMA FULL WIDTH (Diperbarui agar sama dengan Kategori) */}
            <div className="container-fluid px-5 my-5">
                <div className="row justify-content-center text-center">
                    <div className="col-lg-10">
                        <h2 className="fw-bold mb-4">Luxima Metro Media</h2>
                        <p className="lead text-secondary" style={{fontSize: '16px', lineHeight: '1.8', textAlign: 'justify'}}>
                            Hadir sebagai penerbit dan distributor yang berdedikasi tinggi terhadap kemajuan dunia pendidikan dan peningkatan literasi bangsa. Berawal dari keyakinan bahwa fondasi pendidikan yang kuat dimulai sejak usia dini, kami memposisikan diri sebagai mitra terpercaya bagi para pendidik, orang tua, dan institusi.
                        </p>
                        <p className="lead text-secondary mt-3" style={{fontSize: '16px', lineHeight: '1.8', textAlign: 'justify'}}>
                            Perjalanan kami didorong oleh standar kualitas yang tidak kompromi, memastikan bahwa setiap judul — mulai dari buku Pembelajaran yang terstruktur hingga buku Non Fiksi dan Sains yang mendalam — disajikan dengan akurasi data, desain yang menarik, dan material fisik (seperti jenis kertas dan warna cetakan) yang unggul.
                        </p>
                    </div>
                </div>
            </div>

            {/* FOOTER FULL WIDTH */}
            <footer className="text-white pt-5 pb-4 mt-auto" style={{ backgroundColor: '#1a252f' }}>
                <div className="container-fluid px-5 text-center">
                    <p className="small text-secondary">© 2025 Luxima Bookstore. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default About;