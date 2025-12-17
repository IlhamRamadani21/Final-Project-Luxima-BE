import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
   Edit,
   Trash2,
   Plus,
   Search,
   BookOpen,
   ChevronLeft,
   ChevronRight,
   Filter,
   AlertCircle,
   CheckCircle,
} from "lucide-react";
import api from "../../api";

const BookList = () => {
   const [books, setBooks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);

   const fetchBooks = useCallback(async () => {
      setLoading(true);
      try {
         const response = await api.get("/books", {
            params: { search: searchTerm },
         });
         setBooks(response.data.data || []);
      } catch (err) {
         console.log(err);
         setError("Gagal mengambil data buku.");
      } finally {
         setLoading(false);
      }
   }, [searchTerm]);

   useEffect(() => {
      const delayDebounceFn = setTimeout(() => { fetchBooks(); }, 500);
      return () => clearTimeout(delayDebounceFn);
   }, [fetchBooks]);

   const handleDelete = async (id) => {
      if (!window.confirm("Yakin ingin menghapus buku ini?")) return;
      try {
         await api.delete(`/books/${id}`);
         setBooks((prevBooks) => prevBooks.filter((b) => b.id !== id));
         setSuccess("Buku berhasil dihapus.");
      } catch (err) {
         console.log(err);
         setError("Terjadi kesalahan.");
      }
   };

   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = books.slice(indexOfFirstItem, indexOfLastItem);
   const totalPages = Math.ceil(books.length / itemsPerPage);

   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   return (
      <div className="container-fluid px-2 px-md-4 py-4 bg-light min-vh-100">
         {/* Header */}
         <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
               <h2 className="h4 fw-bold text-dark m-0 d-flex align-items-center">
                  <BookOpen className="me-2 text-primary" size={24} /> Manajemen Buku
               </h2>
               <p className="text-muted small m-0">Kelola katalog buku Luxima</p>
            </div>
            <Link to="/admin/books/create" className="btn btn-primary fw-bold shadow-sm d-flex align-items-center justify-content-center px-4 py-2">
               <Plus size={18} className="me-2" /> Tambah Buku
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
            {/* Toolbar */}
            <div className="card-header bg-white py-3 px-3 border-bottom">
               <div className="row g-3 align-items-center">
                  <div className="col-12 col-md-auto d-flex align-items-center">
                     <span className="text-muted small me-2 fw-semibold">Tampilkan</span>
                     <select className="form-select form-select-sm border-secondary border-opacity-25" style={{ width: "80px" }} value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                     </select>
                  </div>
                  <div className="col-12 col-md-5 ms-md-auto">
                     <div className="input-group input-group-sm shadow-sm">
                        <span className="input-group-text bg-white border-end-0"><Search size={16} className="text-muted" /></span>
                        <input type="text" className="form-control border-start-0 bg-white" placeholder="Cari judul, ISBN, atau penulis..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                     </div>
                  </div>
               </div>
            </div>

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
                                 <div className="text-muted opacity-25 mb-3">
                                    <Filter size={48} /> {/* Penggunaan Ikon Filter */}
                                 </div>
                                 <h6 className="text-dark fw-bold">Tidak ada data ditemukan</h6>
                                 <p className="text-muted small m-0 px-3">
                                    Gunakan kata kunci lain atau coba reset filter pencarian Anda.
                                 </p>
                              </td>
                           </tr>
                        ) : (
                           currentItems.map((book) => (
                              <tr key={book.id} className="d-block d-lg-table-row border-bottom py-3 py-lg-0">
                                 {/* Cover */}
                                 <td className="px-4 py-2 py-lg-3 d-inline-block d-lg-table-cell text-center text-lg-start align-middle">
                                    <div className="rounded shadow-sm border overflow-hidden bg-light" style={{ width: "60px", height: "85px" }}>
                                       <img 
                                          src={book.cover_buku ? `http://127.0.0.1:8000/storage/${book.cover_buku}` : "https://via.placeholder.com/60x85?text=No+Cover"} 
                                          className="w-100 h-100 object-fit-cover" 
                                          alt={book.judul} 
                                       />
                                    </div>
                                 </td>

                                 {/* Detail */}
                                 <td className="px-4 py-2 py-lg-3 d-block d-lg-table-cell align-middle">
                                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem', lineHeight: '1.3' }}>{book.judul}</div>
                                    <div className="d-flex flex-wrap gap-2 mt-1">
                                       <span className="badge bg-light text-secondary border fw-normal" style={{ fontSize: '0.7rem' }}>ISBN: {book.isbn}</span>
                                       <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-10" style={{ fontSize: '0.7rem' }}>{book.author?.nama || "Luxima"}</span>
                                    </div>
                                 </td>

                                 {/* Kategori */}
                                 <td className="px-4 py-2 py-lg-3 d-inline-block d-lg-table-cell align-middle">
                                    <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2" style={{ fontSize: '0.75rem' }}>
                                       {book.kategori?.kategori || "Umum"}
                                    </span>
                                 </td>

                                 {/* Harga */}
                                 <td className="px-4 py-2 py-lg-3 d-inline-block d-lg-table-cell align-middle">
                                    <div className="fw-bold text-success" style={{ fontSize: '0.9rem' }}>Rp {Number(book.harga).toLocaleString("id-ID")}</div>
                                    <div className="text-muted small">Hal: <span className="text-dark fw-semibold">{book.hal || "0"}</span></div>
                                 </td>

                                 {/* Aksi */}
                                 <td className="px-4 py-3 py-lg-3 d-block d-lg-table-cell text-lg-end align-middle">
                                    <div className="d-flex justify-content-lg-end gap-2">
                                       <Link to={`/admin/books/edit/${book.id}`} className="btn btn-outline-warning btn-sm shadow-sm p-2" title="Edit">
                                          <Edit size={16} />
                                       </Link>
                                       <button onClick={() => handleDelete(book.id)} className="btn btn-outline-danger btn-sm shadow-sm p-2" title="Hapus">
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

            {/* Footer Pagination */}
            {books.length > 0 && (
               <div className="card-footer bg-white py-3 px-4 border-top">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                     <span className="text-muted small text-center text-md-start">
                        Menampilkan <b>{indexOfFirstItem + 1}</b> - <b>{Math.min(indexOfLastItem, books.length)}</b> dari <b>{books.length}</b> data
                     </span>
                     <nav aria-label="Page navigation">
                        <ul className="pagination pagination-sm m-0 shadow-sm">
                           <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button className="page-link border-0 rounded-start px-3 py-2" onClick={() => paginate(currentPage - 1)}>
                                 <ChevronLeft size={14} />
                              </button>
                           </li>
                           <li className="page-item active">
                              <button className="page-link border-0 px-3 py-2 mx-1 rounded">{currentPage}</button>
                           </li>
                           <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <button className="page-link border-0 rounded-end px-3 py-2" onClick={() => paginate(currentPage + 1)}>
                                 <ChevronRight size={14} />
                              </button>
                           </li>
                        </ul>
                     </nav>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default BookList;