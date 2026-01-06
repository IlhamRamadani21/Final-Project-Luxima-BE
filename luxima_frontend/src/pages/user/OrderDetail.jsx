import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api';
import { ArrowLeft, Upload, CreditCard, MapPin, CheckCircle, FileText } from 'lucide-react';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data.data);
            } catch (error) {
                console.error(error);
                alert("Gagal memuat pesanan");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Pilih foto bukti pembayaran dulu");

        const formData = new FormData();
        formData.append('payment_proof', file);

        setUploading(true);
        try {
            await api.post(`/orders/${id}/pay`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Bukti pembayaran berhasil diupload!");
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal upload");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (!order) return <div className="text-center py-5">Pesanan tidak ditemukan</div>;

    return (
        <div className="bg-light min-vh-100 font-sans">
            <Navbar />
            <div className="container py-5">
                <Link to="/orders" className="text-decoration-none text-muted mb-4 d-inline-block">
                    <ArrowLeft size={16} className="me-1"/> Kembali ke Pesanan Saya
                </Link>

                <div className="row g-4">
                    {/* INFO PESANAN & ITEM */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-header bg-white py-3 px-4 border-bottom">
                                <h5 className="m-0 fw-bold">Detail Pesanan: <span className="text-primary">{order.code}</span></h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-4">
                                    <h6 className="fw-bold text-secondary mb-2"><MapPin size={16} className="me-1"/> Alamat Pengiriman</h6>
                                    <p className="bg-light p-3 rounded text-muted mb-0">{order.shipping_address}</p>
                                </div>

                                <h6 className="fw-bold text-secondary mb-3">Item Dibeli</h6>
                                <div className="list-group list-group-flush">
                                    {order.details.map(item => (
                                        <div className="list-group-item px-0 py-3 d-flex align-items-center gap-3" key={item.id}>
                                            <img 
                                                src={item.book.cover_buku ? `http://127.0.0.1:8000/storage/${item.book.cover_buku}` : "https://via.placeholder.com/50"} 
                                                className="rounded" style={{width: '50px', height: '70px', objectFit: 'cover'}}
                                                alt="Buku"
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1 fw-bold">{item.book.judul}</h6>
                                                <small className="text-muted">{item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}</small>
                                            </div>
                                            <div className="fw-bold">
                                                Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                                    <span className="h5 fw-bold">Total Bayar</span>
                                    <span className="h5 fw-bold text-primary">Rp {Number(order.total_price).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PEMBAYARAN */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Status Pembayaran</h5>
                                
                                <div className="mb-4">
                                    <div className={`alert ${order.status === 'pending_payment' ? 'alert-warning' : 'alert-info'} text-center mb-0`}>
                                        Status: <strong>{order.status.replace('_', ' ').toUpperCase()}</strong>
                                    </div>
                                </div>

                                {order.status === 'pending_payment' && (
                                    <>
                                        <div className="bg-light p-3 rounded mb-4">
                                            <h6 className="fw-bold d-flex align-items-center gap-2"><CreditCard size={18}/> Transfer Bank</h6>
                                            <p className="mb-1 small">Bank BCA: <strong>123-456-7890</strong></p>
                                            <p className="mb-0 small">A/N: Luxima Bookstore</p>
                                        </div>

                                        <form onSubmit={handleUpload}>
                                            <label className="form-label fw-semibold small">Upload Bukti Transfer</label>
                                            
                                            <div className="mb-3">
                                                {preview && (
                                                    <div className="mb-2 text-center">
                                                        <img src={preview} alt="Preview" className="img-fluid rounded shadow-sm" style={{maxHeight: '150px'}} />
                                                    </div>
                                                )}
                                                
                                                <input 
                                                    type="file" 
                                                    id="fileUpload" 
                                                    className="d-none" 
                                                    onChange={handleFileChange} 
                                                    accept="image/*" 
                                                />
                                                <label 
                                                    htmlFor="fileUpload" 
                                                    className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                                                    style={{borderStyle: 'dashed', borderWidth: '2px'}}
                                                >
                                                    {file ? <><CheckCircle size={18} className="text-success"/> Ganti File</> : <><Upload size={18}/> Pilih Gambar</>}
                                                </label>
                                                {file && <div className="small text-center text-muted mt-1">{file.name}</div>}
                                            </div>

                                            <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={uploading || !file}>
                                                {uploading ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
                                            </button>
                                        </form>
                                    </>
                                )}

                                {order.status !== 'pending_payment' && order.payment_proof && (
                                    <div className="text-center">
                                        <p className="text-success fw-bold d-flex align-items-center justify-content-center">
                                            <CheckCircle size={16} className="me-2"/> Bukti Terkirim
                                        </p>
                                        <div className="border rounded p-2 bg-light mt-1">
                                            <img 
                                                src={`http://127.0.0.1:8000/storage/${order.payment_proof}`} 
                                                className="img-fluid rounded" 
                                                alt="Bukti Pembayaran"
                                            />
                                        </div>
                                        <small className="text-muted mt-2 d-block">Admin sedang memverifikasi pembayaran Anda.</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;