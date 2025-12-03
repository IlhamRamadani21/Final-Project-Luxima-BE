import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingId, setUploadingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Mengambil semua data order (Fitur Admin/User digabung dulu untuk MVP)
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("Gagal ambil pesanan:", error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async (orderId) => {
        if (!selectedFile) return alert("Pilih foto bukti dulu!");

        const formData = new FormData();
        formData.append('payment_proof', selectedFile);

        setUploadingId(orderId); // Set loading state

        try {
            await api.post(`/orders/${orderId}/proof`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Bukti berhasil diupload!");
            setSelectedFile(null);
            fetchOrders(); // Refresh data biar status berubah
        } catch (error) {
            console.error(error);
            alert("Gagal upload bukti.");
        } finally {
            setUploadingId(null);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📦 Riwayat Pesanan</h2>
                <Link to="/" className="btn btn-secondary">Kembali ke Katalog</Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    {orders.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID Order</th>
                                        <th>Total Harga</th>
                                        <th>Status</th>
                                        <th>Bukti Pembayaran</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td className="fw-bold">Rp {parseInt(order.total_price).toLocaleString()}</td>
                                            <td>
                                                <span className={`badge ${order.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                    {order.status === 'pending' ? 'Belum Bayar' : 'Sudah Bayar'}
                                                </span>
                                            </td>
                                            <td>
                                                {order.payment_proof ? (
                                                    <a href={`http://127.0.0.1:8000/storage/${order.payment_proof}`} target="_blank" rel="noreferrer" className="text-decoration-none">
                                                        📄 Lihat Bukti
                                                    </a>
                                                ) : (
                                                    <span className="text-muted small">Belum ada</span>
                                                )}
                                            </td>
                                            <td>
                                                {order.status === 'pending' && (
                                                    <div className="d-flex gap-2">
                                                        <input 
                                                            type="file" 
                                                            className="form-control form-control-sm"
                                                            onChange={handleFileChange} 
                                                            style={{maxWidth: '200px'}}
                                                        />
                                                        <button 
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleUpload(order.id)}
                                                            disabled={uploadingId === order.id}
                                                        >
                                                            {uploadingId === order.id ? 'Loading...' : 'Upload'}
                                                        </button>
                                                    </div>
                                                )}
                                                {order.status === 'paid' && (
                                                    <span className="text-success">✅ Menunggu Verifikasi</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center my-4">Belum ada pesanan.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Orders;