import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api';
import { Package, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/my-orders');
                setOrders(response.data.data);
            } catch (error) {
                console.error("Gagal ambil data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Helper warna status
    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending_payment': return <span className="badge bg-warning text-dark">Menunggu Pembayaran</span>;
            case 'pending_verification': return <span className="badge bg-info text-dark">Verifikasi Admin</span>;
            case 'processed': return <span className="badge bg-primary">Diproses</span>;
            case 'shipped': return <span className="badge bg-primary">Dikirim</span>;
            case 'completed': return <span className="badge bg-success">Selesai</span>;
            case 'cancelled': return <span className="badge bg-danger">Dibatalkan</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    return (
        <div className="bg-light min-vh-100 font-sans">
            <Navbar />
            <div className="container py-5">
                <h2 className="h3 fw-bold mb-4 text-dark">Riwayat Pesanan Saya</h2>

                {loading ? (
                    <div className="text-center py-5">Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-5">
                        <Package size={48} className="text-muted mb-3 opacity-50"/>
                        <h5>Belum ada pesanan</h5>
                        <Link to="/" className="btn btn-primary mt-3">Belanja Sekarang</Link>
                    </div>
                ) : (
                    <div className="row g-3">
                        {orders.map(order => (
                            <div className="col-12" key={order.id}>
                                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                    <div className="card-body p-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                                        
                                        {/* Kiri: Info Order */}
                                        <div>
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <span className="fw-bold text-primary">{order.code}</span>
                                                {getStatusBadge(order.status)}
                                            </div>
                                            <div className="text-muted small mb-1">
                                                {new Date(order.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            <div className="fw-bold text-dark">
                                                Total: Rp {Number(order.total_price).toLocaleString('id-ID')}
                                            </div>
                                        </div>

                                        {/* Kanan: Tombol Aksi */}
                                        <div className="text-end">
                                            <Link to={`/orders/${order.id}`} className="btn btn-outline-primary fw-bold rounded-pill px-4">
                                                Detail & Bayar <ChevronRight size={16} className="ms-1"/>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;