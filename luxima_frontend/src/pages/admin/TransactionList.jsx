import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
    Eye, ShoppingBag, Filter, AlertCircle, CheckCircle, 
    Clock, Search as SearchIcon, Truck, XCircle 
} from "lucide-react";
import api from "../../api";

import TableHeader from "../../components/common/TableHeader";
import Pagination from "../../components/common/Pagination";

const TransactionList = () => {
   // --- STATE ---
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10);
   const [filterStatus, setFilterStatus] = useState("all");
   
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);

   // --- FETCH DATA ---
   const fetchOrders = useCallback(async () => {
      setLoading(true);
      try {
         const response = await api.get("/admin/orders");
         setOrders(response.data.data || []);
      } catch (err) {
         console.error(err);
         setError("Gagal mengambil data transaksi.");
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchOrders();
   }, [fetchOrders]);

   // Reset Page saat filter berubah
   useEffect(() => {
      setCurrentPage(1);
   }, [searchTerm, itemsPerPage, filterStatus]);

   // Auto hide notifikasi
   useEffect(() => {
      if (success) {
         const timer = setTimeout(() => setSuccess(null), 3000);
         return () => clearTimeout(timer);
      }
   }, [success]);

   // --- HELPERS ---
   const getStatusBadge = (status) => {
        const style = "badge d-inline-flex align-items-center px-2 py-1 fw-semibold";
        switch(status) {
            case 'pending_payment': return <span className={`${style} bg-warning text-dark`}><Clock size={12} className="me-1"/> Menunggu Bayar</span>;
            case 'pending_verification': return <span className={`${style} bg-info text-dark`}><SearchIcon size={12} className="me-1"/> Perlu Verifikasi</span>;
            case 'processed': return <span className={`${style} bg-primary`}><ShoppingBag size={12} className="me-1"/> Diproses</span>;
            case 'shipped': return <span className={`${style} bg-primary bg-opacity-75`}><Truck size={12} className="me-1"/> Dikirim</span>;
            case 'completed': return <span className={`${style} bg-success`}><CheckCircle size={12} className="me-1"/> Selesai</span>;
            case 'cancelled': return <span className={`${style} bg-danger`}><XCircle size={12} className="me-1"/> Batal</span>;
            default: return <span className={`${style} bg-secondary`}>{status}</span>;
        }
   };

   // --- LOGIC FILTERING & PAGINATION ---
   const filteredOrders = useMemo(() => {
      return orders.filter(order => {
         const matchSearch = 
            order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
         const matchStatus = filterStatus === "all" ? true : order.status === filterStatus;
         return matchSearch && matchStatus;
      });
   }, [orders, searchTerm, filterStatus]);

   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem); 

   return (
      <div className="container-fluid px-2 px-md-4 py-4 bg-light min-vh-100 font-sans">
         {/* Header Section */}
         <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
               <h2 className="h4 fw-bold text-dark m-0 d-flex align-items-center">
                  <ShoppingBag className="me-2 text-primary" size={24} /> Transaksi Masuk
               </h2>
               <p className="text-muted small m-0">Kelola dan verifikasi transaksi pelanggan Anda</p>
            </div>
         </div>

         {/* Alerts */}
         {(success || error) && (
            <div className={`alert ${success ? "alert-success" : "alert-danger"} alert-dismissible fade show shadow-sm border-0 rounded-3 mb-4`} role="alert">
               <div className="d-flex align-items-center">
                  {success ? <CheckCircle size={18} className="me-2" /> : <AlertCircle size={18} className="me-2" />}
                  <span>{success || error}</span>
               </div>
               <button type="button" className="btn-close" onClick={() => { setSuccess(null); setError(null); }}></button>
            </div>
         )}

         {/* Filter Tabs */}
         <div className="d-flex gap-2 mb-3 overflow-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
             {['all', 'pending_verification', 'processed', 'shipped', 'completed', 'cancelled'].map(status => (
                 <button 
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`btn btn-sm rounded-pill px-3 fw-semibold flex-shrink-0 ${filterStatus === status ? 'btn-dark' : 'btn-white border text-secondary shadow-sm'}`}
                 >
                    {status === 'all' ? 'Semua' : status.replace('_', ' ').toUpperCase()}
                 </button>
             ))}
         </div>

         {/* Main Table Card */}
         <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            {/* TableHeader */}
            <TableHeader 
               itemsPerPage={itemsPerPage}
               onItemsPerPageChange={setItemsPerPage}
               searchTerm={searchTerm}
               onSearchChange={setSearchTerm}
               placeholder="Cari No. Order atau Nama..."
            />

            <div className="card-body p-0">
               <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                     <thead className="bg-light d-none d-lg-table-header-group">
                        <tr>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">No. Order</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">Pemesan</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase text-center">Tanggal</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase text-center">Total</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase text-center">Status</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase text-end">Aksi</th>
                        </tr>
                     </thead>
                     <tbody className="border-top-0">
                        {loading ? (
                           <tr>
                              <td colSpan="6" className="text-center py-5">
                                 <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                                 <span className="text-muted small">Memuat data...</span>
                              </td>
                           </tr>
                        ) : currentItems.length === 0 ? (
                           <tr>
                              <td colSpan="6" className="text-center py-5">
                                 <div className="text-muted opacity-25 mb-3"><Filter size={48} /></div>
                                 <h6 className="text-dark fw-bold">Data Kosong</h6>
                                 <p className="text-muted small m-0">Tidak ada transaksi yang sesuai kriteria.</p>
                              </td>
                           </tr>
                        ) : (
                           currentItems.map((order) => (
                              <tr key={order.id} className="d-block d-lg-table-row border-bottom py-2 py-lg-0 px-3 px-lg-0">
                                 
                                 {/* Kode Order */}
                                 <td className="px-lg-4 py-2 py-lg-3 d-flex d-lg-table-cell justify-content-between align-items-center">
                                     <span className="d-lg-none text-muted small fw-bold">NO. ORDER</span>
                                     <span className="fw-bold text-primary">{order.code}</span>
                                 </td>

                                 {/* Pemesan */}
                                 <td className="px-lg-4 py-2 py-lg-3 d-flex d-lg-table-cell justify-content-between align-items-center">
                                     <span className="d-lg-none text-muted small fw-bold">PEMESAN</span>
                                     <div className="text-end text-lg-start">
                                        <div className="fw-semibold text-dark">{order.user?.name}</div>
                                        <div className="text-muted x-small d-none d-md-block">{order.user?.email}</div>
                                     </div>
                                 </td>

                                 {/* Tanggal */}
                                 <td className="px-lg-4 py-2 py-lg-3 d-flex d-lg-table-cell justify-content-between align-items-center text-lg-center">
                                     <span className="d-lg-none text-muted small fw-bold">TANGGAL</span>
                                     <span className="text-secondary small">
                                         {new Date(order.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                     </span>
                                 </td>

                                 {/* Total */}
                                 <td className="px-lg-4 py-2 py-lg-3 d-flex d-lg-table-cell justify-content-between align-items-center text-lg-center">
                                     <span className="d-lg-none text-muted small fw-bold">TOTAL</span>
                                     <span className="fw-bold text-dark">Rp {Number(order.total_price).toLocaleString('id-ID')}</span>
                                 </td>

                                 {/* Status */}
                                 <td className="px-lg-4 py-2 py-lg-3 d-flex d-lg-table-cell justify-content-between align-items-center text-lg-center">
                                     <span className="d-lg-none text-muted small fw-bold">STATUS</span>
                                     {getStatusBadge(order.status)}
                                 </td>

                                 {/* Aksi */}
                                 <td className="px-lg-4 py-3 py-lg-3 d-block d-lg-table-cell text-lg-end">
                                    <Link 
                                        to={`/admin/transactions/${order.id}`} 
                                        className="btn btn-outline-primary btn-sm px-4 rounded-pill d-flex align-items-center justify-content-center w-100 w-lg-auto d-lg-inline-flex"
                                    >
                                        <Eye size={14} className="me-2"/> Detail
                                    </Link>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Pagination */}
            <Pagination 
               currentPage={currentPage}
               totalItems={filteredOrders.length}
               itemsPerPage={itemsPerPage}
               onPageChange={setCurrentPage}
            />
         </div>

         <style dangerouslySetInnerHTML={{ __html: `
            .x-small { font-size: 0.7rem; }
            @media (max-width: 991.98px) {
                .table-hover tbody tr:hover { background-color: rgba(0,0,0,.02); }
                .btn-sm { padding: 0.5rem; }
            }
         `}} />
      </div>
   );
};

export default TransactionList;