import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus, Layers, AlertCircle, CheckCircle, Book, Filter } from "lucide-react";
import api from "../../api";

// Import Komponen Reusable
import TableHeader from "../../components/common/TableHeader";
import Pagination from "../../components/common/Pagination";

const SegmentationList = () => {
   // --- STATE ---
   const [segmentations, setSegmentations] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);

   // --- FETCH DATA ---
   const fetchSegmentations = useCallback(async () => {
      setLoading(true);
      try {
         const response = await api.get("/segmentations");
         setSegmentations(response.data.data || []);
      } catch (err) {
         console.log(err);
         setError("Gagal mengambil data segmentasi.");
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => { fetchSegmentations(); }, [fetchSegmentations]);

   useEffect(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage]);

   useEffect(() => {
      if (success) {
         const timer = setTimeout(() => setSuccess(null), 3000);
         return () => clearTimeout(timer);
      }
   }, [success]);

   // --- DELETE HANDLER ---
   const handleDelete = async (id) => {
      if (!window.confirm("Yakin ingin menghapus segmentasi ini?")) return;
      setError(null); setSuccess(null);
      try {
         await api.delete(`/segmentations/${id}`);
         setSegmentations((prev) => prev.filter((s) => s.id !== id));
         setSuccess("Segmentasi berhasil dihapus.");
      } catch (err) {
         const msg = err.response?.data?.message || "Gagal menghapus segmentasi.";
         setError(msg);
      }
   };

   // --- LOGIC FILTER ---
   const filteredSegmentations = useMemo(() => {
      return segmentations.filter(s => 
         s.segmentasi.toLowerCase().includes(searchTerm.toLowerCase())
      );
   }, [segmentations, searchTerm]);

   // Pagination Logic
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = filteredSegmentations.slice(indexOfFirstItem, indexOfLastItem);

   return (
      <div className="container-fluid px-4 py-4 bg-light min-vh-100 font-sans">
         <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
            <div>
               <h2 className="h4 fw-bold text-dark m-0 d-flex align-items-center">
                  <Layers className="me-2 text-primary" size={24} /> Data Segmentasi
               </h2>
               <p className="text-muted small m-0">Kelola target segmentasi pembaca</p>
            </div>
            <Link to="/admin/segmentations/create" className="btn btn-primary fw-bold shadow-sm d-flex align-items-center px-4">
               <Plus size={18} className="me-2" /> Tambah Segmentasi
            </Link>
         </div>

         {/* Alerts */}
         {(success || error) && (
            <div className={`alert ${success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show shadow-sm border-0 rounded-3 mb-4`} role="alert">
               <div className="d-flex align-items-center">
                  {success ? <CheckCircle size={18} className="me-2" /> : <AlertCircle size={18} className="me-2" />}
                  <span>{success || error}</span>
               </div>
               <button type="button" className="btn-close" onClick={() => {setSuccess(null); setError(null)}}></button>
            </div>
         )}

         <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            
            {/* Header Reusable */}
            <TableHeader 
               itemsPerPage={itemsPerPage}
               onItemsPerPageChange={setItemsPerPage}
               searchTerm={searchTerm}
               onSearchChange={setSearchTerm}
               placeholder="Cari segmentasi..."
            />

            <div className="card-body p-0">
               <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                     <thead className="bg-light">
                        <tr>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase" style={{width: '50px'}}>No</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">Nama Segmentasi</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">Jumlah Buku</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase text-end">Aksi</th>
                        </tr>
                     </thead>
                     <tbody>
                        {loading ? (
                           <tr><td colSpan="4" className="text-center py-5">
                                <div className="spinner-border text-primary spinner-border-sm me-2"></div> Memuat...
                           </td></tr>
                        ) : currentItems.length === 0 ? (
                           <tr><td colSpan="4" className="text-center py-5 text-muted">
                                <Filter size={32} className="opacity-25 mb-2"/><br/>Data tidak ditemukan.
                           </td></tr>
                        ) : (
                           currentItems.map((seg, index) => (
                              <tr key={seg.id} className="border-bottom">
                                 <td className="px-4 py-3 text-muted">{indexOfFirstItem + index + 1}</td>
                                 <td className="px-4 py-3 fw-bold text-dark">{seg.segmentasi}</td>
                                 <td className="px-4 py-3">
                                     <span className={`badge rounded-pill px-3 py-2 ${seg.books_count > 0 ? 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                         <Book size={14} className="me-1"/> {seg.books_count || 0}
                                     </span>
                                 </td>
                                 <td className="px-4 py-3 text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                       <Link to={`/admin/segmentations/edit/${seg.id}`} className="btn btn-outline-warning btn-sm shadow-sm p-2 rounded"><Edit size={16} /></Link>
                                       <button onClick={() => handleDelete(seg.id)} className="btn btn-outline-danger btn-sm shadow-sm p-2 rounded"><Trash2 size={16} /></button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Footer Reusable */}
            <Pagination 
               currentPage={currentPage}
               totalItems={filteredSegmentations.length}
               itemsPerPage={itemsPerPage}
               onPageChange={setCurrentPage}
            />
         </div>
      </div>
   );
};

export default SegmentationList;