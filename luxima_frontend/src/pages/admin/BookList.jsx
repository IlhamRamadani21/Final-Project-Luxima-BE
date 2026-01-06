import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
   Edit,
   Trash2,
   Plus,
   BookOpen,
   Filter,
   AlertCircle,
   CheckCircle,
} from "lucide-react";
import api from "../../api";

import TableHeader from "../../components/common/TableHeader";
import Pagination from "../../components/common/Pagination";

const BookList = () => {
   // --- STATE ---
   const [books, setBooks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);

   // --- FETCH DATA ---
   const fetchBooks = useCallback(async () => {
      setLoading(true);
      try {
         const response = await api.get("/books", {
            params: { search: searchTerm },
         });
         setBooks(response.data.data || []);
      } catch (err) {
         console.error(err);
         setError("Gagal mengambil data buku.");
      } finally {
         setLoading(false);
      }
   }, [searchTerm]);

   useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
         fetchBooks();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
   }, [fetchBooks]);

   // Reset ke halaman 1 jika filter berubah
   useEffect(() => {
      setCurrentPage(1);
   }, [searchTerm, itemsPerPage]);

   // Auto hide notifikasi
   useEffect(() => {
      if (success || error) {
         const timer = setTimeout(() => {
            setSuccess(null);
            setError(null);
         }, 3000);
         return () => clearTimeout(timer);
      }
   }, [success, error]);

   // --- LOGIC PAGINATION ---
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   
   const currentItems = useMemo(() => {
      return books.slice(indexOfFirstItem, indexOfLastItem);
   }, [books, indexOfFirstItem, indexOfLastItem]);

   // --- DELETE HANDLER ---
   const handleDelete = async (id) => {
      if (!window.confirm("Yakin ingin menghapus buku ini?")) return;
      try {
         await api.delete(`/books/${id}`);
         setBooks((prevBooks) => prevBooks.filter((b) => b.id !== id));
         setSuccess("Buku berhasil dihapus.");
         window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
         setError(err.response?.data?.message || "Gagal menghapus buku.");
      }
   };

   return (
      <div className="container-fluid px-3 px-md-4 py-4 bg-light min-vh-100 font-sans">
         {/* HEADER */}
         <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
            <div>
               <h2 className="h4 fw-bold text-dark m-0 d-flex align-items-center">
                  <BookOpen className="me-2 text-primary" size={24} /> Manajemen Buku
               </h2>
               <p className="text-muted small m-0">Kelola katalog buku Luxima</p>
            </div>
            <Link
               to="/admin/books/create"
               className="btn btn-primary fw-bold shadow-sm d-flex align-items-center justify-content-center px-4 py-2"
            >
               <Plus size={18} className="me-2" /> Tambah Buku
            </Link>
         </div>

         {/* ALERTS */}
         {(success || error) && (
            <div className={`alert ${success ? "alert-success" : "alert-danger"} alert-dismissible fade show shadow-sm border-0 rounded-3 mb-4`} role="alert">
               <div className="d-flex align-items-center">
                  {success ? <CheckCircle size={18} className="me-2" /> : <AlertCircle size={18} className="me-2" />}
                  <span>{success || error}</span>
               </div>
               <button type="button" className="btn-close" onClick={() => { setSuccess(null); setError(null); }}></button>
            </div>
         )}

         <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <TableHeader 
               itemsPerPage={itemsPerPage}
               onItemsPerPageChange={setItemsPerPage}
               searchTerm={searchTerm}
               onSearchChange={setSearchTerm}
               placeholder="Cari judul, ISBN, atau penulis..."
            />
            
            <div className="card-body p-0">
               <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                     <thead className="bg-light d-none d-lg-table-header-group">
                        <tr>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase" style={{ width: "100px" }}>Cover</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">Detail Buku</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">Kategori</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">Harga & Stok</th>
                           <th className="px-4 py-3 text-secondary small fw-bold text-uppercase text-end">Aksi</th>
                        </tr>
                     </thead>
                     <tbody className="border-top-0">
                        {loading ? (
                           <tr>
                              <td colSpan="5" className="text-center py-5">
                                 <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                                 <span className="text-muted small">Memuat data buku...</span>
                              </td>
                           </tr>
                        ) : currentItems.length === 0 ? (
                           <tr>
                              <td colSpan="5" className="text-center py-5">
                                 <div className="text-muted opacity-25 mb-3"><Filter size={48} /></div>
                                 <h6 className="text-dark fw-bold">Tidak ada data ditemukan</h6>
                                 <p className="text-muted small m-0">Coba kata kunci lain.</p>
                              </td>
                           </tr>
                        ) : (
                           currentItems.map((book) => (
                              <tr key={book.id} className="d-block d-lg-table-row border-bottom p-3 p-lg-0">
                                 {/* Cover */}
                                 <td className="px-lg-4 py-2 d-flex d-lg-table-cell justify-content-center justify-content-lg-start">
                                    <div className="rounded shadow-sm border overflow-hidden bg-light" style={{ width: "65px", height: "90px" }}>
                                       <img 
                                          src={book.cover_buku ? `http://127.0.0.1:8000/storage/${book.cover_buku}` : "https://via.placeholder.com/65x90?text=No+Cover"} 
                                          className="w-100 h-100 object-fit-cover" 
                                          alt={book.judul}
                                          onError={(e) => { e.target.src = "https://via.placeholder.com/65x90?text=Err"; }}
                                       />
                                    </div>
                                 </td>

                                 {/* Detail */}
                                 <td className="px-lg-4 py-2 d-block d-lg-table-cell text-center text-lg-start">
                                    <div className="fw-bold text-dark mb-1" style={{ fontSize: "1rem" }}>{book.judul}</div>
                                    <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2 mt-1">
                                       <span className="badge bg-light text-secondary border fw-normal">ISBN: {book.isbn}</span>
                                       <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-10">{book.author?.nama || "N/A"}</span>
                                    </div>
                                 </td>

                                 {/* Kategori */}
                                 <td className="px-lg-4 py-2 d-block d-lg-table-cell text-center text-lg-start">
                                    <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2">
                                       {book.kategori?.kategori || "Umum"}
                                    </span>
                                 </td>

                                 {/* Harga & Stok */}
                                 <td className="px-lg-4 py-2 d-block d-lg-table-cell text-center text-lg-start">
                                    <div className="fw-bold text-success">
                                       Rp {Number(book.harga).toLocaleString("id-ID")}
                                    </div>
                                    <div className="text-muted small">
                                       Stok: <span className={`fw-bold ${Number(book.catatan) > 0 ? "text-dark" : "text-danger"}`}>{book.catatan || "0"}</span>
                                    </div>
                                 </td>

                                 {/* Aksi */}
                                 <td className="px-lg-4 py-3 d-block d-lg-table-cell">
                                    <div className="d-flex justify-content-center justify-content-lg-end gap-2">
                                       <Link to={`/admin/books/edit/${book.id}`} className="btn btn-outline-warning btn-sm shadow-sm p-2 rounded flex-fill flex-lg-grow-0">
                                          <Edit size={18} className="d-block mx-auto" />
                                       </Link>
                                       <button onClick={() => handleDelete(book.id)} className="btn btn-outline-danger btn-sm shadow-sm p-2 rounded flex-fill flex-lg-grow-0">
                                          <Trash2 size={18} className="d-block mx-auto" />
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

            <Pagination 
               currentPage={currentPage}
               totalItems={books.length}
               itemsPerPage={itemsPerPage}
               onPageChange={setCurrentPage}
            />
         </div>
      </div>
   );
};

export default BookList;