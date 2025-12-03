import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', {
                name: name,
                email: email,
                password: password
            });
            alert('Registrasi Berhasil! Silakan Login.');
            navigate('/login'); // Lempar ke halaman login setelah sukses
        } catch (error) {
            console.error(error);
            alert('Registrasi Gagal! Pastikan email belum terdaftar.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
                <h3 className="text-center mb-4">Daftar Akun</h3>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Nama Lengkap</label>
                        <input type="text" className="form-control" 
                            value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" 
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" 
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-success w-100">Daftar Sekarang</button>
                    
                    <div className="text-center mt-3">
                        <small>Sudah punya akun? <Link to="/login">Login disini</Link></small>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;