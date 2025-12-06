import React from 'react';

const Footer = () => (
    <footer className="text-white pt-5 pb-4 mt-auto" style={{ backgroundColor: '#1a252f' }}>
        <div className="container">
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
                        <li>🏠 Jl. Jaha Gg. Mujahidin No.25</li>
                        <li>Jakarta, Indonesia</li>
                    </ul>
                </div>
                <div className="col-md-4">
                    <h5 className="fw-bold mb-3">Payment Method</h5>
                    <p className="small text-secondary">DANA, OVO, Bank Transfer</p>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;