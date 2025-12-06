import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

import registerImg from '../assets/images/kids.png'; 

const Register = () => {
    const navigate = useNavigate();
    
    // State form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('http://127.0.0.1:8000/api/register', {
                name: name,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation
            });

            alert('Registrasi Berhasil! Silakan Login.');
            navigate('/login');

        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                // Mengambil pesan error validasi
                setError(Object.values(err.response.data.errors).flat().join(', '));
            } else {
                setError('Terjadi kesalahan saat registrasi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card login-card">
                            <div className="row g-0">
                                
                                <div className="col-md-6 form-side bg-white order-2 order-md-1">
                                    <div className="text-center mb-4">
                                        <h2 className="fw-bold" style={{ color: '#1f5061' }}>Register</h2>
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger small" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleRegister}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small">Nama Lengkap</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Nama lengkap Anda"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold small">Email</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                placeholder="Contoh: user@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold small">Password</label>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                placeholder="Minimal 8 karakter"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold small">Konfirmasi Password</label>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                placeholder="Ulangi password"
                                                value={passwordConfirmation}
                                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="btn btn-custom w-100"
                                            disabled={loading}
                                        >
                                            {loading ? 'Memproses...' : 'Register'}
                                        </button>
                                    </form>

                                    <div className="text-center mt-4 small">
                                        <span className="text-muted">Sudah punya akun? </span>
                                        <Link to="/login" style={{ color: '#1f5061', fontWeight: 'bold' }} className="text-decoration-none">
                                            Login disini
                                        </Link>
                                    </div>
                                </div>

                                <div className="col-md-6 illustration-side d-none d-md-flex order-1 order-md-2">
                                    <img 
                                        src={registerImg} 
                                        alt="Ilustrasi Register" 
                                        className="img-fluid"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;