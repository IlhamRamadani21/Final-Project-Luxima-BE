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
   const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = filteredAuthors.slice(
      indexOfFirstItem,
      indexOfLastItem
   );

   // Fungsi Navigasi
   const goToFirstPage = () => setCurrentPage(1);
   const goToLastPage = () => setCurrentPage(totalPages);
   const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
   const goToNextPage = () =>
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
   const goToPage = (page) => setCurrentPage(page);

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
            {/* TOOLBAR (Search & Rows Per Page) */}
            <div className="card-header bg-white py-3 px-4 border-bottom">
               <div className="row g-3 align-items-center justify-content-between">
                  {/* KIRI: Rows Per Page Selector */}
                  <div className="col-auto d-flex align-items-center">
                     <span className="text-muted small me-2 fw-semibold">
                        Tampilkan
                     </span>
                     <select
                        className="form-select form-select-sm border-secondary border-opacity-25"
                        style={{ width: "70px", cursor: "pointer" }}
                        value={itemsPerPage}
                        onChange={(e) =>
                           setItemsPerPage(Number(e.target.value))
                        }
                     >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                     </select>
                     <span className="text-muted small ms-2 fw-semibold">
                        baris
                     </span>
                  </div>

                  {/* KANAN: Search Bar */}
                  <div className="col-12 col-md-4">
                     <div className="input-group input-group-sm shadow-sm">
                        <span className="input-group-text bg-white border-end-0">
                           <Search size={16} className="text-muted" />
                        </span>
                        <input
                           type="text"
                           className="form-control border-start-0 bg-white"
                           placeholder="Cari nama penulis..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>
               </div>
            </div>

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
            {filteredAuthors.length > 0 && (
               <div className="card-footer bg-white py-3 px-4 border-top">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                     {/* Info Data */}
                     <span className="text-muted small">
                        Menampilkan{" "}
                        <span className="fw-bold text-dark">
                           {indexOfFirstItem + 1}
                        </span>{" "}
                        -{" "}
                        <span className="fw-bold text-dark">
                           {Math.min(indexOfLastItem, filteredAuthors.length)}
                        </span>{" "}
                        dari{" "}
                        <span className="fw-bold text-dark">
                           {filteredAuthors.length}
                        </span>{" "}
                        data
                     </span>

                     {/* Pagination Controls */}
                     <nav aria-label="Page navigation">
                        <ul className="pagination pagination-sm m-0 shadow-sm">
                           {/* First Page */}
                           <li
                              className={`page-item ${
                                 currentPage === 1 ? "disabled" : ""
                              }`}
                           >
                              <button
                                 className="page-link border-0 rounded-start px-2 py-2"
                                 onClick={goToFirstPage}
                                 title="Halaman Pertama"
                              >
                                 <ChevronsLeft size={14} />
                              </button>
                           </li>

                           {/* Prev Page */}
                           <li
                              className={`page-item ${
                                 currentPage === 1 ? "disabled" : ""
                              }`}
                           >
                              <button
                                 className="page-link border-0 px-2 py-2"
                                 onClick={goToPrevPage}
                                 title="Sebelumnya"
                              >
                                 <ChevronLeft size={14} />
                              </button>
                           </li>

                           {/* Page Numbers */}
                           {[...Array(totalPages)].map((_, i) => {
                              const page = i + 1;
                              // Tampilkan halaman Pertama, Terakhir, dan tetangga Current Page
                              if (
                                 page === 1 ||
                                 page === totalPages ||
                                 (page >= currentPage - 1 &&
                                    page <= currentPage + 1)
                              ) {
                                 return (
                                    <li
                                       key={i}
                                       className={`page-item ${
                                          currentPage === page ? "active" : ""
                                       }`}
                                    >
                                       <button
                                          className="page-link border-0 px-3 py-2 mx-1 rounded"
                                          onClick={() => goToPage(page)}
                                       >
                                          {page}
                                       </button>
                                    </li>
                                 );
                              } else if (
                                 page === currentPage - 2 ||
                                 page === currentPage + 2
                              ) {
                                 return (
                                    <li key={i} className="page-item disabled">
                                       <span className="page-link border-0 px-2">
                                          ...
                                       </span>
                                    </li>
                                 );
                              }
                              return null;
                           })}

                           {/* Next Page */}
                           <li
                              className={`page-item ${
                                 currentPage === totalPages ? "disabled" : ""
                              }`}
                           >
                              <button
                                 className="page-link border-0 px-2 py-2"
                                 onClick={goToNextPage}
                                 title="Selanjutnya"
                              >
                                 <ChevronRight size={14} />
                              </button>
                           </li>

                           {/* Last Page */}
                           <li
                              className={`page-item ${
                                 currentPage === totalPages ? "disabled" : ""
                              }`}
                           >
                              <button
                                 className="page-link border-0 rounded-end px-2 py-2"
                                 onClick={goToLastPage}
                                 title="Halaman Terakhir"
                              >
                                 <ChevronsRight size={14} />
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

export default AuthorList;
