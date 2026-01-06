import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";
import { useCart } from "../hooks/useCart";
import { Search, X } from "lucide-react";

const Category = () => {
   // --- STATE DATA ---
   const [segmentations, setSegmentations] = useState([]);
   const [allCategories, setAllCategories] = useState([]);
   const [allBooksMaster, setAllBooksMaster] = useState([]); // Database lengkap
   const [books, setBooks] = useState([]); // Yang tampil di layar

   // --- STATE FILTER ---
   const [selectedSegId, setSelectedSegId] = useState("all");
   const [selectedKatId, setSelectedKatId] = useState(null);

   // --- STATE SEARCH & URL ---
   const [searchParams, setSearchParams] = useSearchParams();
   const urlKeyword = searchParams.get("search") || ""; // Ambil ?search=... dari URL
   const [localSearch, setLocalSearch] = useState(urlKeyword); // State input lokal

   const [loading, setLoading] = useState(false);
   const { addToCart } = useCart();

   const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
         minimumFractionDigits: 0,
      }).format(price);
   };

   // FETCH DATA AWAL
   useEffect(() => {
      const fetchInitialData = async () => {
         try {
            setLoading(true);
            const [segData, catData, bookData] = await Promise.all([
               api.get("/segmentations"),
               api.get("/genres"),
               api.get("/books"),
            ]);

            setSegmentations(segData.data.data || []);
            setAllCategories(catData.data.data || []);
            setAllBooksMaster(bookData.data.data || []);
            // setBooks akan dihandle oleh useEffect Filtering di bawah
         } catch (error) {
            console.error("Gagal memuat data:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchInitialData();
   }, []);

   // SYNC URL SEARCH DENGAN INPUT LOKAL
   // Jika URL berubah (misal dari Navbar), update input di halaman Kategori
   useEffect(() => {
      setLocalSearch(urlKeyword);
   }, [urlKeyword]);

   // LOGIC FILTERING
   // Dijalankan setiap kali data master, segmen, kategori, atau keyword berubah
   useEffect(() => {
      let result = allBooksMaster;

      // Filter Segmentasi
      if (selectedSegId !== "all") {
         result = result.filter((b) => b.segmentasi_id === selectedSegId);
      }

      // Filter Kategori
      if (selectedKatId) {
         result = result.filter((b) => b.kategori_id === selectedKatId);
      }

      // Filter Search Keyword (Dari URL)
      if (urlKeyword) {
         const lowerQ = urlKeyword.toLowerCase();
         result = result.filter(
            (b) =>
               b.judul.toLowerCase().includes(lowerQ) ||
               (b.author?.nama || "").toLowerCase().includes(lowerQ) ||
               (b.isbn || "").includes(lowerQ)
         );
      }

      setBooks(result);
   }, [allBooksMaster, selectedSegId, selectedKatId, urlKeyword]);

   // --- HANDLERS ---

   // Handle Submit Search Bar Lokal
   const handleLocalSearch = (e) => {
      e.preventDefault();
      // Update URL, ini akan men-trigger useEffect filtering di atas
      setSearchParams({ search: localSearch });
   };

   // Handle Clear Search
   const handleClearSearch = () => {
      setLocalSearch("");
      setSearchParams({}); // Hapus query params
   };

   const handleSegmentationClick = (segId) => {
      setSelectedKatId(null);
      setSelectedSegId(segId);
   };

   const handleCategoryClick = (katId) => {
      if (selectedKatId === katId) {
         setSelectedKatId(null); // Toggle off
      } else {
         setSelectedKatId(katId);
      }
   };

   // Filter Kategori List agar sesuai Segmen yang dipilih
   const filteredCategoryButtons =
      selectedSegId === "all"
         ? allCategories
         : allCategories.filter((cat) => cat.segmentasi_id === selectedSegId);

   return (
      <main
         className="min-vh-100 bg-light"
      >
         <Navbar />

         <div className="container py-5">
            <header className="text-center mb-4">
               <h2 className="fw-bold display-6 mb-2">Katalog Koleksi Buku</h2>
               <p className="text-muted">
                  Temukan buku favorit Anda dari koleksi lengkap kami
               </p>
            </header>

            {/* --- SEARCH BAR --- */}
            <div className="row justify-content-center mb-5">
               <div className="col-md-10 col-lg-8">
                  <form onSubmit={handleLocalSearch}>
                     <div
                        className="d-flex align-items-center bg-white rounded-pill shadow p-2 border"
                        style={{
                           transition: "all 0.3s ease",
                           border: "1px solid #e9ecef",
                        }}
                     >
                        {/* Icon Kiri */}
                        <div className="ps-3 pe-2 text-muted opacity-50">
                           <Search size={24} />
                        </div>

                        {/* Input Field */}
                        <input
                           type="text"
                           className="form-control border-0 shadow-none bg-transparent fs-5 text-dark"
                           placeholder="Cari judul buku, penulis, atau ISBN..."
                           value={localSearch}
                           onChange={(e) => setLocalSearch(e.target.value)}
                           style={{ height: "50px" }}
                        />

                        {/* Tombol Clear (X) - Muncul jika ada teks */}
                        {localSearch && (
                           <button
                              type="button"
                              className="btn btn-link text-muted p-2 me-2 text-decoration-none rounded-circle hover-bg-light"
                              onClick={handleClearSearch}
                              title="Hapus pencarian"
                           >
                              <X size={20} />
                           </button>
                        )}

                        {/* Tombol Submit (Desktop: Teks, Mobile: Icon) */}
                        <button
                           className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-none d-sm-block"
                           type="submit"
                           style={{ minWidth: "130px", height: "48px" }}
                        >
                           Cari Buku
                        </button>

                        {/* Tombol Submit Mobile (Bulat) */}
                        <button
                           className="btn btn-primary rounded-circle p-0 d-block d-sm-none shadow-sm"
                           type="submit"
                           style={{ width: "48px", height: "48px" }}
                        >
                           <Search size={20} />
                        </button>
                     </div>
                  </form>
               </div>
            </div>

            {/* FILTER SECTION */}
            <section className="mb-5 shadow-sm p-4 bg-white rounded-4 border-0">
               {/* Tombol Segmentasi */}
               <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-uppercase small text-primary tracking-wider">
                     Segmentasi
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                     <button
                        onClick={() => handleSegmentationClick("all")}
                        className={`btn rounded-pill px-4 transition-all ${
                           selectedSegId === "all"
                              ? "btn-primary shadow"
                              : "btn-outline-secondary"
                        }`}
                     >
                        Semua
                     </button>
                     {segmentations.map((seg) => (
                        <button
                           key={seg.id}
                           onClick={() => handleSegmentationClick(seg.id)}
                           className={`btn rounded-pill px-4 transition-all ${
                              selectedSegId === seg.id
                                 ? "btn-primary shadow"
                                 : "btn-outline-secondary"
                           }`}
                        >
                           {seg.segmentasi}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Tombol Kategori */}
               <div className="animate__animated animate__fadeIn">
                  <h6 className="fw-bold mb-3 text-uppercase small text-success tracking-wider">
                     Kategori{" "}
                     {selectedSegId !== "all" &&
                        `(${filteredCategoryButtons.length})`}
                  </h6>

                  <div className="d-flex flex-wrap gap-2">
                     <button
                        onClick={() => setSelectedKatId(null)}
                        className={`btn btn-sm rounded-pill px-3 transition-all ${
                           selectedKatId === null
                              ? "btn-success shadow"
                              : "btn-outline-success"
                        }`}
                     >
                        Semua Kategori
                     </button>
                     {filteredCategoryButtons.length > 0 ? (
                        filteredCategoryButtons.map((kat) => (
                           <button
                              key={kat.id}
                              onClick={() => handleCategoryClick(kat.id)}
                              className={`btn btn-sm rounded-pill px-3 transition-all ${
                                 selectedKatId === kat.id
                                    ? "btn-success shadow"
                                    : "btn-outline-success"
                              }`}
                           >
                              {kat.kategori}
                           </button>
                        ))
                     ) : (
                        <span className="text-muted small py-1">
                           Tidak ada kategori di segmen ini.
                        </span>
                     )}
                  </div>
               </div>
            </section>

            {/* RESULT HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
               <div>
                  <h5 className="fw-bold m-0 text-dark">Hasil Pencarian</h5>
                  {urlKeyword && (
                     <span className="text-muted small">
                        Menampilkan hasil untuk: <strong>"{urlKeyword}"</strong>
                     </span>
                  )}
               </div>
               <span className="badge bg-soft-primary text-primary ms-2 fs-6">
                  {books.length} Buku Ditemukan
               </span>
            </div>

            {/* LOADING STATE */}
            {loading && (
               <div className="text-center py-5">
                  <div
                     className="spinner-border text-primary"
                     role="status"
                  ></div>
                  <p className="text-muted mt-2">Memuat buku...</p>
               </div>
            )}

            {/* EMPTY STATE */}
            {!loading && books.length === 0 && (
               <div className="col-12 text-center py-5 bg-white rounded-4 border border-dashed">
                  <div className="display-1 text-muted opacity-25 mb-3">📚</div>
                  <h5 className="text-muted">
                     Tidak ada buku yang cocok dengan filter/pencarian Anda.
                  </h5>
                  <button
                     onClick={handleClearSearch}
                     className="btn btn-outline-primary mt-3 rounded-pill"
                  >
                     Reset Pencarian
                  </button>
               </div>
            )}

            {/* GRID BUKU */}
            <div className="row g-4">
               {books.map((book) => (
                  <div className="col-6 col-md-4 col-lg-3" key={book.id}>
                     <div className="card h-100 border-0 bg-white shadow-sm hover-lift transition-all rounded-3 overflow-hidden">
                        <div
                           className="position-relative d-flex align-items-center justify-content-center overflow-hidden bg-light"
                           style={{ height: "280px", padding: "15px" }}
                        >
                           {book.cover_buku ? (
                              <img
                                 src={`http://127.0.0.1:8000/storage/${book.cover_buku}`}
                                 alt={book.judul}
                                 className="w-100 h-100 shadow-sm"
                                 style={{ objectFit: "contain" }}
                                 onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                 }}
                              />
                           ) : (
                              <div className="d-flex flex-column align-items-center justify-content-center text-muted">
                                 <span className="fs-1">📖</span>
                                 <small className="opacity-75">No Cover</small>
                              </div>
                           )}
                           <div className="d-none flex-column align-items-center justify-content-center text-muted position-absolute w-100 h-100 bg-light">
                              <span className="fs-1">📖</span>
                              <small>No Image</small>
                           </div>
                        </div>

                        <div className="card-body p-3 d-flex flex-column">
                           <h6
                              className="card-title fw-bold text-dark mb-1 text-truncate"
                              title={book.judul}
                           >
                              {book.judul}
                           </h6>
                           <p className="text-muted small mb-3 text-truncate-2 flex-grow-1">
                              {book.author?.nama || "Penulis tidak diketahui"}
                           </p>
                           <div className="mt-auto">
                              <h6 className="fw-bold text-primary mb-3">
                                 {formatPrice(book.harga)}
                              </h6>
                              <div className="d-grid gap-2">
                                 <Link
                                    to={`/kategori/detail/${book.id}`}
                                    className="btn btn-sm btn-outline-primary rounded-2 py-2 fw-medium"
                                 >
                                    Detail Produk
                                 </Link>
                                 <button
                                    onClick={() => addToCart(book.id)}
                                    className="btn btn-sm btn-primary rounded-2 py-2 fw-medium"
                                 >
                                    + Keranjang
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <style>{`
  .hover-lift {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1) !important;
  }

  .bg-soft-primary {
    backgroundColor: #e7f0ff;
    color: #0d6efd;
  }

  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .transition-all {
    transition: all 0.3s ease;
  }

  .hover-bg-light:hover {
    background-color: #f8f9fa;
  }

  /* Efek Glow saat input diklik */
  form:focus-within > div {
    box-shadow: 0 0.5rem 1rem rgba(13, 110, 253, 0.15) !important;
    border-color: #86b7fe !important;
  }
`}</style>
      </main>
   );
};

export default Category;
