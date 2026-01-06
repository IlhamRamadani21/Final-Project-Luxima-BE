import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
   ArrowLeft,
   Save,
   AlertCircle,
   MapPin,
   User,
   Package,
   CreditCard,
   Truck,
} from "lucide-react";
import api from "../../api";

const TransactionDetail = () => {
   const { id } = useParams();
   const navigate = useNavigate();

   const [order, setOrder] = useState(null);
   const [loading, setLoading] = useState(true);
   const [status, setStatus] = useState("");
   const [resi, setResi] = useState("");
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState(null);

   // Fetch Detail
   useEffect(() => {
      const fetchOrder = async () => {
         try {
            const response = await api.get(`/admin/orders/${id}`);
            const data = response.data.data;
            setOrder(data);
            setStatus(data.status);
            setResi(data.tracking_number || "");
         } catch (err) {
            console.error(err);
            alert("Gagal memuat transaksi");
            navigate("/admin/transactions");
         } finally {
            setLoading(false);
         }
      };
      fetchOrder();
   }, [id, navigate]);

   // Handle Update Status
   const handleUpdate = async (e) => {
      e.preventDefault();
      setSaving(true);
      setError(null);

      try {
         await api.patch(`/admin/orders/${id}`, {
            status: status,
            tracking_number: status === "shipped" ? resi : null,
         });
         alert("Status pesanan berhasil diperbarui!");
         navigate("/admin/transactions");
      } catch (err) {
         setError(err.response?.data?.message || "Gagal update status");
      } finally {
         setSaving(false);
      }
   };

   if (loading) return <div className="text-center py-5">Loading...</div>;
   if (!order) return null;

   return (
      <div className="container-fluid px-4 py-4 bg-light min-vh-100 font-sans">
         {/* Header */}
         <div className="d-flex align-items-center gap-3 mb-4">
            <Link
               to="/admin/transactions"
               className="btn btn-outline-secondary rounded-circle p-2"
            >
               <ArrowLeft size={20} />
            </Link>
            <div>
               <h2 className="h4 fw-bold text-dark m-0">
                  Detail Transaksi #{order.code}
               </h2>
               <p className="text-muted small m-0">
                  Tanggal Order:{" "}
                  {new Date(order.created_at).toLocaleDateString("id-ID", {
                     dateStyle: "full",
                  })}
               </p>
            </div>
         </div>

         {error && (
            <div className="alert alert-danger d-flex align-items-center shadow-sm rounded-3 mb-4">
               <AlertCircle className="me-2" size={20} /> {error}
            </div>
         )}

         <div className="row g-4">
            {/* KOLOM KIRI: INFO ORDER & ITEM */}
            <div className="col-lg-8">
               {/* Item Purchased */}
               <div className="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden">
                  <div className="card-header bg-white py-3 px-4 border-bottom">
                     <h6 className="m-0 fw-bold text-primary d-flex align-items-center">
                        <Package size={18} className="me-2" /> Item Dipesan
                     </h6>
                  </div>
                  <div className="card-body p-0">
                     <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                           <thead className="bg-light">
                              <tr>
                                 <th className="px-4 py-2 small fw-bold text-secondary">
                                    Produk
                                 </th>
                                 <th className="px-4 py-2 small fw-bold text-secondary text-center">
                                    Harga
                                 </th>
                                 <th className="px-4 py-2 small fw-bold text-secondary text-center">
                                    Qty
                                 </th>
                                 <th className="px-4 py-2 small fw-bold text-secondary text-center">
                                    Subtotal
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {order.details.map((item) => (
                                 <tr key={item.id} style={{ height: "80px" }}>
                                    <td className="px-4 py-3 align-middle">
                                       <div className="d-flex align-items-center gap-3">
                                          <img
                                             src={
                                                item.book.cover_buku
                                                   ? `http://127.0.0.1:8000/storage/${item.book.cover_buku}`
                                                   : "https://via.placeholder.com/40"
                                             }
                                             className="rounded border"
                                             style={{
                                                width: "40px",
                                                height: "55px",
                                                objectFit: "cover",
                                             }}
                                          />
                                          <div className="text-start">
                                             <div className="fw-semibold text-dark lh-sm">
                                                {item.book.judul}
                                             </div>
                                             <div className="small text-muted">
                                                ISBN: {item.book.isbn}
                                             </div>
                                          </div>
                                       </div>
                                    </td>

                                    {/* Kolom Harga */}
                                    <td className="px-4 py-3 align-middle">
                                       <div className="d-flex justify-content-center align-items-center h-100">
                                          <span className="text-muted">
                                             Rp{" "}
                                             {Number(item.price).toLocaleString(
                                                "id-ID"
                                             )}
                                          </span>
                                       </div>
                                    </td>

                                    {/* Kolom Qty */}
                                    <td className="px-4 py-3 align-middle">
                                       <div className="d-flex justify-content-center align-items-center h-100">
                                          <span>{item.quantity}</span>
                                       </div>
                                    </td>

                                    {/* Kolom Subtotal */}
                                    <td className="px-4 py-3 align-middle">
                                       <div className="d-flex justify-content-center align-items-center h-100">
                                          <span className="fw-bold text-dark">
                                             Rp{" "}
                                             {(
                                                item.price * item.quantity
                                             ).toLocaleString("id-ID")}
                                          </span>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                           <tfoot className="bg-light">
                              <tr>
                                 <td
                                    colSpan="3"
                                    className="text-end px-4 py-3 fw-bold text-secondary"
                                 >
                                    TOTAL BAYAR
                                 </td>
                                 <td className="px-4 py-3 text-end fw-bold text-primary fs-6">
                                    Rp{" "}
                                    {Number(order.total_price).toLocaleString(
                                       "id-ID"
                                    )}
                                 </td>
                              </tr>
                           </tfoot>
                        </table>
                     </div>
                  </div>
               </div>

               {/* Info Pengiriman & User */}
               <div className="row g-4">
                  <div className="col-md-6">
                     <div className="card shadow-sm border-0 rounded-4 h-100">
                        <div className="card-body p-4">
                           <h6 className="fw-bold text-secondary mb-3 d-flex align-items-center">
                              <User size={18} className="me-2" /> Informasi
                              Pemesan
                           </h6>
                           <p className="mb-1 fw-bold">{order.user?.name}</p>
                           <p className="mb-0 text-muted small">
                              {order.user?.email}
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="col-md-6">
                     <div className="card shadow-sm border-0 rounded-4 h-100">
                        <div className="card-body p-4">
                           <h6 className="fw-bold text-secondary mb-3 d-flex align-items-center">
                              <MapPin size={18} className="me-2" /> Alamat
                              Pengiriman
                           </h6>
                           <p className="mb-0 text-muted bg-light p-3 rounded small">
                              {order.shipping_address}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* KOLOM KANAN: UPDATE STATUS & BUKTI */}
            <div className="col-lg-4">
               {/* Form Update Status */}
               <div className="card shadow-sm border-0 rounded-4 mb-4">
                  <div className="card-header bg-white py-3 px-4 border-bottom">
                     <h6 className="m-0 fw-bold text-dark">
                        Update Status Pesanan
                     </h6>
                  </div>
                  <div className="card-body p-4">
                     <form onSubmit={handleUpdate}>
                        <div className="mb-3">
                           <label className="form-label small fw-bold text-secondary">
                              Status Saat Ini
                           </label>
                           <select
                              className="form-select"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                           >
                              <option value="pending_payment">
                                 Menunggu Pembayaran
                              </option>
                              <option value="pending_verification">
                                 Menunggu Verifikasi (Ada Bukti)
                              </option>
                              <option value="processed">
                                 Diproses (Packing)
                              </option>
                              <option value="shipped">
                                 Dikirim (Input Resi)
                              </option>
                              <option value="completed">Selesai</option>
                              <option value="cancelled">Dibatalkan</option>
                           </select>
                        </div>

                        {/* Input Resi (Hanya muncul jika status Shipped) */}
                        {status === "shipped" && (
                           <div className="mb-3 animate__animated animate__fadeIn">
                              <label className="form-label small fw-bold text-secondary d-flex align-items-center">
                                 <Truck size={16} className="me-1" /> Nomor Resi
                                 Pengiriman
                              </label>
                              <input
                                 type="text"
                                 className="form-control"
                                 placeholder="Contoh: JNE12345678"
                                 value={resi}
                                 onChange={(e) => setResi(e.target.value)}
                                 required
                              />
                           </div>
                        )}

                        <button
                           type="submit"
                           className="btn btn-primary w-100 fw-bold shadow-sm mt-2"
                           disabled={saving}
                        >
                           <Save size={18} className="me-2" />
                           {saving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                     </form>
                  </div>
               </div>

               {/* Bukti Pembayaran */}
               <div className="card shadow-sm border-0 rounded-4">
                  <div className="card-header bg-white py-3 px-4 border-bottom">
                     <h6 className="m-0 fw-bold text-dark d-flex align-items-center">
                        <CreditCard size={18} className="me-2" /> Bukti
                        Pembayaran
                     </h6>
                  </div>
                  <div className="card-body p-4 text-center">
                     {order.payment_proof ? (
                        <>
                           <div className="border rounded p-2 bg-light mb-3">
                              <a
                                 href={`http://127.0.0.1:8000/storage/${order.payment_proof}`}
                                 target="_blank"
                                 rel="noreferrer"
                              >
                                 <img
                                    src={`http://127.0.0.1:8000/storage/${order.payment_proof}`}
                                    alt="Bukti Transfer"
                                    className="img-fluid rounded shadow-sm"
                                 />
                              </a>
                           </div>
                           <a
                              href={`http://127.0.0.1:8000/storage/${order.payment_proof}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-primary btn-sm rounded-pill"
                           >
                              Lihat Ukuran Penuh
                           </a>
                        </>
                     ) : (
                        <div className="py-5 text-muted bg-light rounded border border-dashed">
                           <AlertCircle size={32} className="mb-2 opacity-50" />
                           <p className="mb-0 small">
                              User belum mengupload bukti pembayaran.
                           </p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TransactionDetail;
