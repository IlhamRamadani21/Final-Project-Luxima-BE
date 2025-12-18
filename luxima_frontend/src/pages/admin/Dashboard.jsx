import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Tags, TrendingUp, PlusCircle, ArrowRight } from 'lucide-react';
import api from '../../api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        books: 0,
        authors: 0,
        genres: 0,
        segments: 0
    });
    const [loading, setLoading] = useState(true);
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // Fetch Data untuk menghitung statistik
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [resBooks, resAuthors, resGenres, resSegments] = await Promise.all([
                    api.get('/books'),
                    api.get('/authors'),
                    api.get('/genres'),
                    api.get('/segmentations')
                ]);

                setStats({
                    books: resBooks.data.data?.length || 0,
                    authors: resAuthors.data.data?.length || 0,
                    genres: resGenres.data.data?.length || 0,
                    segments: resSegments.data.data?.length || 0
                });
            } catch (error) {
                console.error("Gagal memuat statistik dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Component Kartu Statistik Kecil
    const StatCard = ({ title, count, icon, color, link }) => (
        <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-scale" style={{transition: 'transform 0.2s'}}>
                <div className="card-body p-4 position-relative">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <p className="text-secondary fw-semibold small text-uppercase mb-1">{title}</p>
                            <h3 className="fw-bold text-dark m-0">{loading ? '...' : count}</h3>
                        </div>
                        <div className={`p-3 rounded-3 bg-opacity-10 text-white`} style={{backgroundColor: color}}>
                           {React.cloneElement(icon, { size: 24, color: 'white' })}
                        </div>
                    </div>
                    <Link to={link} className="text-decoration-none small fw-bold d-flex align-items-center" style={{color: color}}>
                        Lihat Detail <ArrowRight size={14} className="ms-1"/>
                    </Link>
                    
                    {/* Hiasan Background (Circle) */}
                    <div 
                        className="position-absolute rounded-circle opacity-25" 
                        style={{
                            width: '100px', 
                            height: '100px', 
                            backgroundColor: color, 
                            top: '-20px', 
                            right: '-20px', 
                            filter: 'blur(20px)'
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid px-0">
            {/* Header Welcome */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                <div>
                    <h2 className="fw-bold text-dark m-0">Dashboard Overview</h2>
                    <p className="text-secondary m-0 mt-1">Selamat datang kembali, {user?.name}! Berikut ringkasan toko hari ini.</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/admin/books/create" className="btn btn-primary fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center">
                        <PlusCircle size={18} className="me-2" /> Tambah Buku
                    </Link>
                </div>
            </div>

            {/* Statistik Grid */}
            <div className="row g-4 mb-5">
                <StatCard 
                    title="Total Buku" 
                    count={stats.books} 
                    icon={<BookOpen />} 
                    color="#3b82f6"
                    link="/admin/books"
                />
                <StatCard 
                    title="Total Penulis" 
                    count={stats.authors} 
                    icon={<Users />} 
                    color="#10b981"
                    link="/admin/authors"
                />
                <StatCard 
                    title="Kategori" 
                    count={stats.genres} 
                    icon={<Tags />} 
                    color="#f59e0b"
                    link="/admin/genres"
                />
                <StatCard 
                    title="Segmentasi" 
                    count={stats.segments} 
                    icon={<TrendingUp />} 
                    color="#8b5cf6"
                    link="/admin/segmentations"
                />
            </div>

            {/* Quick Actions / Recent Section (Placeholder) */}
            <div className="row">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-white py-3 px-4 border-bottom">
                            <h5 className="m-0 fw-bold text-dark">Aktivitas Terbaru</h5>
                        </div>
                        <div className="card-body p-5 text-center">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" 
                                alt="Empty" 
                                style={{width: '100px', opacity: 0.5}} 
                                className="mb-3"
                            />
                            <h6 className="text-muted fw-semibold">Belum ada aktivitas transaksi terbaru.</h6>
                            <p className="small text-secondary">Data transaksi akan muncul di sini setelah pelanggan melakukan checkout.</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4">
                     <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-primary text-white">
                        <div className="card-body p-4 text-center">
                            <h4 className="fw-bold mb-3">Butuh Bantuan?</h4>
                            <p className="opacity-75 mb-4 small">Jika mengalami kendala teknis pada dashboard admin, hubungi tim IT Support.</p>
                            <button className="btn btn-light text-primary fw-bold w-100 rounded-3">
                                Hubungi IT Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;