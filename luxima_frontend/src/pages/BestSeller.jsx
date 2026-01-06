import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, TrendingUp, Trophy, ShoppingCart, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api";
import { useCart } from "../hooks/useCart";

const BestSeller = () => {
   const [books, setBooks] = useState([]);
   const [loading, setLoading] = useState(true);
   const { addToCart } = useCart();

   useEffect(() => {
      const fetchBestSellers = async () => {
         try {
            setLoading(true);
            const response = await api.get('/books?is_best_seller=1');
            setBooks(response.data.data || []);
         } catch (error) {
            console.error("Gagal memuat best seller", error);
         } finally {
            setLoading(false);
         }
      };
      fetchBestSellers();
   }, []);

   const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
         minimumFractionDigits: 0,
      }).format(price);
   };

   return (
      <main className="min-vh-100 bg-light font-sans">
         <Navbar />
         
         {/* HERO BANNER */}
         <section className="position-relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
             <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.1, backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
             
             <div className="container position-relative py-5">
                 <div className="row align-items-center py-4">
                     <div className="col-lg-7 text-center text-lg-start">
                         <div className="d-inline-flex align-items-center bg-white bg-opacity-25 rounded-pill px-3 py-1 mb-3 border border-light border-opacity-25">
                             <TrendingUp size={16} className="me-2 text-warning" />
                             <span className="small fw-bold text-uppercase tracking-wider">Koleksi Terpopuler</span>
                         </div>
                         <h1 className="display-4 fw-bold mb-3">Buku Paling Diminati <br/> <span className="text-warning">Minggu Ini</span></h1>
                         <p className="lead opacity-90 mb-4">
                             Temukan inspirasi dari buku-buku yang paling banyak dibaca dan dicintai oleh komunitas Luxima.
                         </p>
                     </div>
                     <div className="col-lg-5 text-center d-none d-lg-block">
                         <Trophy size={180} className="text-warning opacity-75 drop-shadow" />
                     </div>
                 </div>
             </div>
         </section>

         <div className="container py-5">
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted mt-2">Menyiapkan koleksi terbaik...</p>
                </div>
            )}

            {!loading && books.length === 0 && (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed">
                    <div className="display-1 text-muted opacity-25 mb-3">⭐</div>
                    <h4 className="fw-bold text-dark">Belum Ada Best Seller</h4>
                    <p className="text-muted">Koleksi best seller akan segera hadir.</p>
                    <Link to="/kategori" className="btn btn-outline-primary rounded-pill px-4 mt-2">Lihat Semua Buku</Link>
                </div>
            )}

            {/* GRID BUKU */}
            <div className="row g-4">
               {books.map((book) => (
                   <div className="col-6 col-md-4 col-lg-3" key={book.id}>
                      <div className="card h-100 border-0 bg-white shadow-hover rounded-4 overflow-hidden position-relative">
                         
                         {/* RIBBON BEST SELLER */}
                         <div className="position-absolute top-0 start-0 m-0 z-2">
                             <div className="bg-warning text-dark fw-bold px-3 py-1 rounded-bottom-end shadow-sm d-flex align-items-center" style={{borderBottomRightRadius: '12px', fontSize: '0.75rem'}}>
                                <Star size={14} className="me-1 fill-dark" /> Best Seller
                             </div>
                         </div>

                         {/* CONTAINER GAMBAR */}
                         <div 
                            className="position-relative d-flex align-items-center justify-content-center overflow-hidden bg-light"
                            style={{ height: "260px", padding: "20px" }}
                         >
                            {book.cover_buku ? (
                               <img 
                                  src={`http://127.0.0.1:8000/storage/${book.cover_buku}`} 
                                  alt={book.judul} 
                                  className="w-100 h-100 shadow-sm rounded-2"
                                  style={{ objectFit: "contain" }}
                                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                               />
                            ) : (
                               <div className="d-flex flex-column align-items-center justify-content-center text-muted opacity-50">
                                  <span style={{fontSize: '3rem'}}>📖</span>
                               </div>
                            )}
                            <div className="d-none flex-column align-items-center justify-content-center text-muted position-absolute w-100 h-100 bg-light">
                                <span style={{fontSize: '3rem'}}>📖</span>
                            </div>
                         </div>

                         {/* INFO BUKU & TOMBOL */}
                         <div className="card-body p-3 d-flex flex-column">
                            {/* Judul */}
                            <h6 className="card-title fw-bold text-dark mb-1 text-truncate" title={book.judul}>
                               {book.judul}
                            </h6>
                            {/* Penulis */}
                            <p className="text-muted small mb-2 text-truncate">{book.author?.nama || "Penulis"}</p>
                            
                            {/* Harga */}
                            <div className="mb-3">
                                <h6 className="fw-bold text-primary m-0">{formatPrice(book.harga)}</h6>
                            </div>

                            {/* TOMBOL AKSI */}
                            <div className="mt-auto d-grid gap-2">
                                <Link 
                                    to={`/kategori/detail/${book.id}`} 
                                    className="btn btn-sm btn-outline-primary rounded-2 fw-medium d-flex align-items-center justify-content-center"
                                >
                                    Detail Produk
                                </Link>
                                <button 
                                    onClick={() => addToCart(book.id)} 
                                    className="btn btn-sm btn-primary rounded-2 fw-medium d-flex align-items-center justify-content-center"
                                >
                                    + Keranjang
                                </button>
                            </div>
                         </div>
                      </div>
                   </div>
               ))}
            </div>
         </div>

         <style>{`
            .font-sans { font-family: 'Segoe UI', Roboto, sans-serif; }
            .shadow-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
            .shadow-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
            .fill-dark { fill: #212529; }
            .drop-shadow { filter: drop-shadow(0 10px 10px rgba(0,0,0,0.3)); }
         `}</style>
      </main>
   );
};

export default BestSeller;