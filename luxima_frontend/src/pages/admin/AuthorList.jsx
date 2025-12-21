import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
   Edit,
   Trash2,
   Plus,
   Search,
   Users,
   AlertCircle,
   CheckCircle,
   Book,
   ChevronLeft,
   ChevronRight,
   ChevronsLeft,
   ChevronsRight,
   Filter,
} from "lucide-react";
import api from "../../api";

import TableHeader from "../../components/common/TableHeader";
import Pagination from "../../components/common/Pagination";

const AuthorList = () => {
   // --- STATE UTAMA ---
   const [authors, setAuthors] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");

   // --- STATE PAGINATION ---
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 data per halaman

   // --- STATE NOTIFIKASI ---
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);

   // --- FETCH DATA ---
   const fetchAuthors = useCallback(async () => {
      setLoading(true);
      try {
         const response = await api.get("/authors");
         setAuthors(response.data.data || []);
      } catch (err) {
         console.log(err);
         setError("Gagal mengambil data penulis.");
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchAuthors();
   }, [fetchAuthors]);

   // Reset ke Halaman 1 jika user mencari data atau mengubah jumlah baris
   useEffect(() => {
      setCurrentPage(1);
   }, [searchTerm, itemsPerPage]);

   // Auto hide notifikasi
   useEffect(() => {
      if (success) {
         const timer = setTimeout(() => setSuccess(null), 3000);
         return () => clearTimeout(timer);
      }
   }, [success]);

   // --- DELETE HANDLER ---
   const handleDelete = async (id) => {
      if (!window.confirm("Yakin ingin menghapus penulis ini?")) return;

      setError(null);
      setSuccess(null);

      try {
         await api.delete(`/authors/${id}`);
         setAuthors((prev) => prev.filter((a) => a.id !== id));
         setSuccess("Penulis berhasil dihapus.");
         window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
         const msg = err.response?.data?.message || "Gagal menghapus penulis.";
         setError(msg);
         window.scrollTo({ top: 0, behavior: "smooth" });
      }
   };

   // Filter Data (Client Side)
   const filteredAuthors = useMemo(() => {
      return authors.filter((author) =>
         author.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
   }, [authors, searchTerm]);

   // Hitung Index
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = filteredAuthors.slice(
      indexOfFirstItem,
      indexOfLastItem
   );

   return (
      <div className="container-fluid px-4 py-4 bg-light min-vh-100 font-sans">
         {/* HEADER PAGE */}
         <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
            <div>
               <h2 className="h4 fw-bold text-dark m-0 d-flex align-items-center">
                  <Users className="me-2 text-primary" size={24} /> Data Penulis
               </h2>
               <p className="text-muted small m-0">
                  Kelola daftar penulis buku
               </p>
            </div>
            <Link
               to="/admin/authors/create"
               className="btn btn-primary fw-bold shadow-sm d-flex align-items-center px-4"
            >
               <Plus size={18} className="me-2" /> Tambah Penulis
            </Link>
         </div>

         {/* NOTIFIKASI */}
         {(success || error) && (
            <div
               className={`alert ${
                  success ? "alert-success" : "alert-danger"
               } alert-dismissible fade show shadow-sm border-0 rounded-3 mb-4`}
               role="alert"
            >
               <div className="d-flex align-items-center">
                  {success ? (
                     <CheckCircle size={18} className="me-2" />
                  ) : (
                     <AlertCircle size={18} className="me-2" />
                  )}
                  <span>{success || error}</span>
               </div>
               <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                     setSuccess(null);
                     setError(null);
                  }}
               ></button>
            </div>
         )}

         {/* CARD UTAMA */}
         <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <TableHeader
               itemsPerPage={itemsPerPage}
               onItemsPerPageChange={setItemsPerPage}
               searchTerm={searchTerm}
               onSearchChange={setSearchTerm}
               placeholder="Cari penulis..."
            />

            {/* TABLE */}
            <div className="card-body p-0">
               <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                     <thead className="bg-light">
                        <tr>
                           <th
                              className="px-4 py-3 text-secondary small fw-bold text-uppercase"
                              style={{ width: "50px" }}
                           >
                              No
                           </th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">
                              Nama Penulis
                           </th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">
                              Jumlah Buku
                           </th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase text-end">
                              Aksi
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {loading ? (
                           <tr>
                              <td colSpan="4" className="text-center py-5">
                                 <div
                                    className="spinner-border text-primary spinner-border-sm me-2"
                                    role="status"
                                 ></div>
                                 <span className="text-muted small">
                                    Memuat data...
                                 </span>
                              </td>
                           </tr>
                        ) : currentItems.length === 0 ? (
                           <tr>
                              <td colSpan="5" className="text-center py-5">
                                 <div className="text-muted opacity-25 mb-3">
                                    <Filter size={48} />
                                 </div>
                                 <h6 className="text-dark fw-bold">
                                    Tidak ada data ditemukan
                                 </h6>
                                 <p className="text-muted small m-0 px-3">
                                    Gunakan kata kunci lain atau coba reset
                                    filter pencarian Anda.
                                 </p>
                              </td>
                           </tr>
                        ) : (
                           currentItems.map((author, index) => (
                              <tr key={author.id} className="border-bottom">
                                 <td className="px-4 py-3 text-muted">
                                    {indexOfFirstItem + index + 1}
                                 </td>
                                 <td className="px-4 py-3 fw-bold text-dark">
                                    {author.nama}
                                 </td>
                                 <td className="px-4 py-3">
                                    <span
                                       className={`badge rounded-pill px-3 py-2 ${
                                          author.books_count > 0
                                             ? "bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10"
                                             : "bg-secondary bg-opacity-10 text-secondary"
                                       }`}
                                    >
                                       <Book size={14} className="me-1" />
                                       {author.books_count || 0} Buku
                                    </span>
                                 </td>
                                 <td className="px-4 py-3 text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                       <Link
                                          to={`/admin/authors/edit/${author.id}`}
                                          className="btn btn-outline-warning btn-sm shadow-sm p-2 rounded"
                                          title="Edit"
                                       >
                                          <Edit size={16} />
                                       </Link>
                                       <button
                                          onClick={() =>
                                             handleDelete(author.id)
                                          }
                                          className="btn btn-outline-danger btn-sm shadow-sm p-2 rounded"
                                          title="Hapus"
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* FOOTER PAGINATION */}
            <Pagination
               currentPage={currentPage}
               totalItems={filteredAuthors.length}
               itemsPerPage={itemsPerPage}
               onPageChange={setCurrentPage}
            />
         </div>
      </div>
   );
};

export default AuthorList;
