import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

import loginImg from '../assets/images/kids.png'; 

const Login = () => {
    const navigate = useNavigate();
    
    // State untuk form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State untuk handling UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email: email,
                password: password
            });

            // Jika sukses:
            // 1. Simpan token dan data user ke localStorage
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // 2. Redirect berdasarkan role (Sementara ke Home dulu)
            // const role = response.data.user.role;
            // if(role === 'admin') navigate('/admin/dashboard'); else navigate('/');
            
            alert('Login Berhasil!');
            navigate('/'); 

        } catch (err) {
            // Tangkap error dari backend
            if (err.response && err.response.data && err.response.data.errors) {
                 // Error validasi dari Laravel
                setError(Object.values(err.response.data.errors).flat().join(', '));
            } else if (err.response && err.response.data.message) {
                // Error umum (misal kredensial salah)
                setError(err.response.data.message);
            } else {
                setError('Terjadi kesalahan koneksi ke server.');
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
                                <div className="col-md-6 illustration-side d-none d-md-flex">
                                    {/* Ilustrasi */}
                                    <img 
                                        src={loginImg}
                                        alt="Ilustrasi Membaca" 
                                        className="img-fluid"
                                    />
                                </div>

                                <div className="col-md-6 form-side bg-white">
                                    <div className="text-center mb-4">
                                        <h2 className="fw-bold" style={{ color: '#1f5061' }}>Login</h2>
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleLogin}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small">Email</label>
                                            <div className="input-group">
                                                <input 
                                                    type="email" 
                                                    className="form-control" 
                                                    placeholder="Masukkan email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold small">Password</label>
                                            <div className="input-group">
                                                <input 
                                                    type="password" 
                                                    className="form-control" 
                                                    placeholder="Masukkan password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="btn btn-custom w-100"
                                            disabled={loading}
                                        >
                                            {loading ? 'Memproses...' : 'Login'}
                                        </button>
                                    </form>

                                    <div className="d-flex justify-content-between mt-4 small">
                                        <Link to="/register" className="text-decoration-none text-muted">
                                            Create an account
                                        </Link>
                                        <Link to="/forgot-password" style={{ color: '#1f5061', fontWeight: 'bold' }} className="text-decoration-none">
                                            Forget password?
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;