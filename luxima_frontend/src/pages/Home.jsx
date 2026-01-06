import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../hooks/useCart";

function Home() {
   const [books, setBooks] = useState([]);
   const [searchParams] = useSearchParams();
   const searchQuery = searchParams.get("search");
   const { addToCart } = useCart();

   useEffect(() => {
      const fetchBooks = async () => {
         try {
            // Panggil API dengan parameter search
            const response = await api.get("/books", {
               params: {
                  search: searchQuery,
               },
            });

            setBooks(response.data.data || response.data || []);
         } catch (error) {
            console.error("Gagal ambil buku:", error);
         }
      };

      fetchBooks();
   }, [searchQuery]);

   // Helper warna placeholder
   const getPlaceholderColor = (index) => {
      const colors = ["#FF0000", "#FFC09F", "#2D6A4F", "#D3D3D3", "#A69090"];
      return colors[index % colors.length];
   };

   // --- RENDER TAMPILAN ---
   return (
      <div>
         {/* 1. TOP HEADER (container-fluid px-4) */}
         <Navbar />

         {/* 3. KONTEN UTAMA (container-fluid px-4) */}
         <div className="container-fluid px-4 my-5">
            {/* HERO SECTION */}
            <section className="py-4">
               <div className="row align-items-center">
                  <div className="col-md-6 ps-lg-5">
                     <h6 className="text-uppercase text-muted ls-1 small fw-bold">Books on Wellbeing</h6>
                     <h1 className="display-4 fw-bold mb-3 text-dark">Temukan kisah inspiratif dalam novel "Langit Senja".</h1>
                     <p className="text-secondary mb-4 fs-5">Perjalanan cinta dan harapan yang lahir di balik luka masa lalu.</p>
                     <button className="btn text-white px-5 py-2 shadow-sm rounded-pill" style={{ backgroundColor: "#5D7B93" }}>
                        Show all
                     </button>

                     <div className="d-flex gap-2 mt-5">
                        <span
                           style={{
                              width: 30,
                              height: 4,
                              background: "#5D7B93",
                              borderRadius: 2,
                           }}
                        ></span>
                        <span
                           style={{
                              width: 30,
                              height: 4,
                              background: "#ddd",
                              borderRadius: 2,
                           }}
                        ></span>
                        <span
                           style={{
                              width: 30,
                              height: 4,
                              background: "#ddd",
                              borderRadius: 2,
                           }}
                        ></span>
                     </div>
                  </div>
                  <div className="col-md-6 position-relative d-flex justify-content-center mt-5 mt-md-0" style={{ minHeight: "400px" }}>
                     <div
                        className="shadow"
                        style={{
                           width: 260,
                           height: 340,
                           background: "#D90429",
                           position: "absolute",
                           right: "35%",
                           top: "5%",
                           zIndex: 1,
                           borderRadius: "8px",
                        }}
                     ></div>
                     <div
                        className="shadow"
                        style={{
                           width: 240,
                           height: 320,
                           background: "#FFC09F",
                           position: "absolute",
                           right: "20%",
                           top: "20%",
                           zIndex: 2,
                           borderRadius: "8px",
                        }}
                     ></div>
                  </div>
               </div>
            </section>

            <hr style={{ borderTop: "4px solid #f1f1f1", margin: "3rem 0" }} />

            {/* DYNAMIC BOOK GRID */}
            <div className="d-flex justify-content-between align-items-end mb-4 px-lg-2">
               <h5 className="fw-bold text-uppercase text-dark m-0 fs-4">Eksplor Bestsellers</h5>
               <Link to="/kategori" className="text-muted small text-decoration-none fw-bold">
                  View more &gt;
               </Link>
            </div>

            <div className="row g-4 mb-5">
               {/* Placeholder Statis (Visual Only) */}
               {books.length === 0 && (
                  <>
                     <div className="col-md-6 col-lg-3">
                        <div className="rounded shadow-sm" style={{ height: "200px", backgroundColor: "#D90429" }}></div>
                     </div>
                     <div className="col-md-6 col-lg-3">
                        <div className="rounded shadow-sm" style={{ height: "200px", backgroundColor: "#FFC09F" }}></div>
                     </div>
                     <div className="col-md-6 col-lg-3">
                        <div className="rounded shadow-sm" style={{ height: "200px", backgroundColor: "#2D6A4F" }}></div>
                     </div>
                     <div className="col-md-6 col-lg-3">
                        <div className="rounded shadow-sm" style={{ height: "200px", backgroundColor: "#D3D3D3" }}></div>
                     </div>
                  </>
               )}

               {/* Data Buku Asli */}
               {books.length > 0 &&
                  books.map((book, index) => (
                     <div className="col-md-6 col-lg-3 col-xl-3" key={book.id || index}>
                        <div className="card h-100 border-0 bg-transparent hover-lift">
                           <div
                              className="rounded shadow-sm mb-3 d-flex align-items-center justify-content-center text-white position-relative overflow-hidden"
                              style={{
                                 height: "280px",
                                 backgroundColor: getPlaceholderColor(index),
                                 cursor: "pointer",
                              }}
                           >
                              {book.cover_buku ? (
                                 <img
                                    src={`http://127.0.0.1:8000/storage/${book.cover_buku}`}
                                    alt={book.judul}
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                    onError={(e) => {
                                       e.target.style.display = "none"; // Sembunyikan gambar jika link rusak (404)
                                       e.target.nextSibling.style.display = "block"; // Munculkan placeholder
                                    }}
                                 />
                              ) : (
                                 <span className="fs-1 opacity-50">📖</span>
                              )}

                              {/* Hidden by default, muncul jika gambar error */}
                              {book.cover_buku && (
                                 <span className="fs-1 opacity-50 position-absolute" style={{ display: "none" }}>
                                    📖
                                 </span>
                              )}
                           </div>

                           <div className="card-body p-0">
                              <div className="text-muted small mb-1 text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                                 {book.author?.nama || "Unknown Author"}
                              </div>
                              <h6 className="card-title fw-bold text-dark text-truncate mb-2" title={book.judul}>
                                 {book.judul}
                              </h6>
                              <div className="d-flex justify-content-between align-items-center border-top pt-2">
                                 <span className="fw-bold text-dark">
                                    {/* Pastikan menggunakan format Rupiah Indonesia */}
                                    Rp {book.harga ? Number(book.harga).toLocaleString("id-ID") : "0"}
                                 </span>
                                 <button
                                    onClick={() => {
                                       addToCart(book.id);
                                    }}
                                    className="btn btn-link text-decoration-none p-0 small fw-bold"
                                    style={{ color: "#3498db", fontSize: "13px" }}
                                 >
                                    Add to cart 🛒
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
            </div>
         </div>

         {/* 5. FOOTER (container-fluid px-4) */}
         <footer className="text-white pt-5 pb-4 mt-auto" style={{ backgroundColor: "#1a252f" }}>
            <div className="container-fluid px-4">
               <div className="row g-4">
                  <div className="col-md-4">
                     <h5 className="fw-bold mb-3">Luxima</h5>
                     <p className="small text-secondary lh-lg">Toko buku online terlengkap dengan pengalaman belanja yang nyaman.</p>
                  </div>
                  <div className="col-md-4">
                     <h5 className="fw-bold mb-3">Info Perusahaan</h5>
                     <ul className="list-unstyled small text-secondary lh-lg">
                        <li>🏠 Jl. Jaha Gg. Mujahidin No.25, RT.9/RW.1, Kalisari, Kec. Ps. Rebo, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13790</li>
                        <li>Jakarta, Indonesia</li>
                     </ul>
                  </div>
                  <div className="col-md-4">
                     <h5 className="fw-bold mb-3">Payment Method</h5>
                     <p className="small text-secondary">DANA, OVO, Bank Transfer</p>
                  </div>
               </div>
               <div className="text-center mt-5 pt-3 border-top border-secondary small text-secondary">&copy; © 2025 Luxima Bookstore. All rights reserved.</div>
            </div>
         </footer>

         <style>
            {`
                .hover-underline:hover {
                    color: #5D7B93 !important;
                    text-decoration: underline;
                }
                .hover-lift {
                    transition: transform 0.2s;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                }
                `}
         </style>
      </div>
   );
}

export default Home;
