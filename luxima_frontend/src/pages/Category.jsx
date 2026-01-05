import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSegmentations } from "../_services/segmentations";
import { getCategories } from "../_services/categories";
import { getBooks } from "../_services/book";
import Navbar from "../components/Navbar";

const Category = () => {
   const [segmentations, setSegmentations] = useState([]);
   const [allCategories, setAllCategories] = useState([]);
   const [filteredCategories, setFilteredCategories] = useState([]);
   const [allBooksMaster, setAllBooksMaster] = useState([]);
   const [books, setBooks] = useState([]);

   const [selectedSegId, setSelectedSegId] = useState("all");
   const [selectedKatId, setSelectedKatId] = useState(null);
   const [loading, setLoading] = useState(false);

   // Helper Warna Placeholder jika gambar tidak ada

   // Helper untuk format mata uang
   const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
         minimumFractionDigits: 0,
      }).format(price);
   };

   useEffect(() => {
      const fetchInitialData = async () => {
         try {
            setLoading(true);
            const [segData, catData, bookData] = await Promise.all([getSegmentations(), getCategories(), getBooks()]);
            setSegmentations(segData);
            setAllCategories(catData);
            setAllBooksMaster(bookData);
            setBooks(bookData);
         } catch (error) {
            console.error("Gagal memuat data:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchInitialData();
   }, []);

   const handleSegmentationClick = (segId) => {
      setSelectedKatId(null);
      if (segId === "all") {
         setSelectedSegId("all");
         setFilteredCategories([]);
         setBooks(allBooksMaster);
      } else {
         setSelectedSegId(segId);
         const filtered = allCategories.filter((cat) => cat.segmentasi_id === segId);
         setFilteredCategories(filtered);
         const booksInSegmen = allBooksMaster.filter((b) => b.segmentasi_id === segId);
         setBooks(booksInSegmen);
      }
   };

   const handleCategoryClick = (katId) => {
      setSelectedKatId(katId);
      const booksByKategori = allBooksMaster.filter((buku) => buku.kategori_id === katId);
      setBooks(booksByKategori);
   };

   return (
      <main className="min-vh-100 bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>
         <Navbar />

         <div className="container py-5">
            <header className="text-center mb-5">
               <h2 className="fw-bold display-6 mb-2">Katalog Koleksi Buku</h2>
               <p className="text-muted">Pilih segmen dan kategori untuk mempersempit pencarian Anda</p>
            </header>

            {/* Filter Section */}
            <section className="mb-5 shadow-sm p-4 bg-white rounded-4 border-0">
               <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-uppercase small text-primary tracking-wider">Pilih Segmentasi</h6>
                  <div className="d-flex flex-wrap gap-2">
                     <button onClick={() => handleSegmentationClick("all")} className={`btn rounded-pill px-4 transition-all ${selectedSegId === "all" ? "btn-primary shadow" : "btn-outline-secondary"}`}>
                        Semua
                     </button>
                     {segmentations.map((seg) => (
                        <button key={seg.id} onClick={() => handleSegmentationClick(seg.id)} className={`btn rounded-pill px-4 transition-all ${selectedSegId === seg.id ? "btn-primary shadow" : "btn-outline-secondary"}`}>
                           {seg.segmentasi}
                        </button>
                     ))}
                  </div>
               </div>

               {selectedSegId !== "all" && (
                  <div className="animate__animated animate__fadeIn">
                     <h6 className="fw-bold mb-3 text-uppercase small text-success tracking-wider">Kategori Tersedia</h6>
                     <div className="d-flex flex-wrap gap-2">
                        {filteredCategories.length > 0 ? (
                           filteredCategories.map((kat) => (
                              <button key={kat.id} onClick={() => handleCategoryClick(kat.id)} className={`btn btn-sm rounded-pill px-3 ${selectedKatId === kat.id ? "btn-success shadow" : "btn-outline-success"}`}>
                                 {kat.kategori}
                              </button>
                           ))
                        ) : (
                           <div className="text-muted small">Kategori tidak tersedia untuk segmen ini.</div>
                        )}
                     </div>
                  </div>
               )}
            </section>

            {/* Book Listing */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
               <h5 className="fw-bold m-0 text-dark">
                  {selectedSegId === "all" ? "Seluruh Koleksi" : "Hasil Filter"}
                  <span className="badge bg-soft-primary text-primary ms-2 fs-6">{books.length} Buku</span>
               </h5>
               {loading && <div className="spinner-border spinner-border-sm text-primary"></div>}
            </div>

            <div className="row g-4">
               {books.length > 0
                  ? books.map((book) => (
                       <div className="col-6 col-md-4 col-lg-3" key={book.id}>
                          <div className="card h-100 border-0 bg-white shadow-sm hover-lift transition-all rounded-3 overflow-hidden">
                             {/* Container gambar*/}
                             <div
                                className="position-relative d-flex align-items-center justify-content-center overflow-hidden"
                                style={{
                                   height: "280px",
                                   backgroundColor: "#f0f0f0",
                                   padding: "15px",
                                }}
                             >
                                {book.cover_buku ? (
                                   <>
                                      <img
                                         src={`http://127.0.0.1:8000/storage/${book.cover_buku}`}
                                         alt={book.judul}
                                         className="w-100 h-100 shadow-sm"
                                         style={{
                                            objectFit: "contain", // Agar cover gak terpotong saat dipadding
                                            display: "block",
                                         }}
                                         onLoad={(e) => {
                                            // Sembunyikan placeholder jika gambar berhasil load
                                            e.target.nextSibling.style.display = "none";
                                         }}
                                         onError={(e) => {
                                            // Sembunyikan gambar jika error 404,
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display = "flex";
                                         }}
                                      />
                                   </>
                                ) : (
                                   /* Kondisi Jika memang tidak ada data cover di database */
                                   <div className="d-flex flex-column align-items-center justify-content-center text-muted">
                                      <span className="fs-1">📖</span>
                                      <small className="opacity-75">No Cover</small>
                                   </div>
                                )}
                             </div>

                             <div className="card-body p-3 d-flex flex-column">
                                <h6 className="card-title fw-bold text-dark mb-1 text-truncate" title={book.judul}>
                                   {book.judul}
                                </h6>
                                <p className="text-muted small mb-3 text-truncate-2 flex-grow-1">{book.description || "Tidak ada deskripsi tersedia untuk buku ini."}</p>

                                <div className="mt-auto">
                                   <h6 className="fw-bold text-primary mb-3">{formatPrice(book.harga)}</h6>
                                   <div className="d-grid gap-2">
                                      <Link to={`/kategori/detail/${book.id}`} className="btn btn-sm btn-outline-primary rounded-2 py-2 fw-medium">
                                         Detail Produk
                                      </Link>
                                      <button className="btn btn-sm btn-primary rounded-2 py-2 fw-medium">+ Keranjang</button>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    ))
                  : !loading && (
                       <div className="col-12 text-center py-5">
                          <div className="display-1 text-muted opacity-25">📚</div>
                          <h5 className="mt-3 text-muted">Buku tidak ditemukan</h5>
                       </div>
                    )}
            </div>
         </div>

         <style>{`
            .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
            .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important; }
            .bg-soft-primary { backgroundColor: #e7f0ff; color: #0d6efd; }
            .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .transition-all { transition: all 0.3s ease; }
            .object-fit-cover { object-fit: cover; }
         `}</style>
      </main>
   );
};

export default Category;
