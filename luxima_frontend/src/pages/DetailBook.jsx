import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api"; 
import { useCart } from "../hooks/useCart"; 

const DetailBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data.data);
      } catch (error) {
        console.error("Gagal memuat detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <main className="min-vh-100 bg-light" style={{ fontFamily: "Segoe UI, sans-serif" }}>
      <Navbar />
      
      <div className="container py-5">
        <button 
          className="btn btn-outline-secondary mb-4 rounded-pill px-4" 
          onClick={() => navigate(-1)}
        >
          ← Kembali
        </button>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : !book ? (
          <div className="alert alert-warning text-center rounded-4 shadow-sm">
            Buku tidak ditemukan.
          </div>
        ) : (
          <div className="row bg-white p-4 p-md-5 shadow-sm rounded-4">
            {/* Kolom Kiri: Cover Buku */}
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <div className="p-2 border rounded-3 bg-light d-inline-block">
                  {book.cover_buku ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${book.cover_buku}`}
                        alt={book.judul}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "500px", objectFit: "cover" }}
                      />
                  ) : (
                      <div className="d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 rounded" style={{width: '300px', height: '400px'}}>
                          <span className="fs-1 text-muted">No Cover</span>
                      </div>
                  )}
              </div>
            </div>
            
            {/* Kolom Kanan: Detail */}
            <div className="col-md-8">
              {/* Badge Kategori */}
              <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill">
                  {book.kategori?.kategori || "Umum"}
              </span>
              
              {/* Judul & Harga */}
              <h1 className="fw-bold text-dark mb-2">{book.judul}</h1>
              <h3 className="text-success fw-bold mb-4">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(book.harga)}
              </h3>

              <div className="p-4 bg-light rounded-4 mb-4">
                  <h6 className="fw-bold text-secondary mb-2">Deskripsi</h6>
                  <p className="text-secondary mb-0" style={{lineHeight: '1.8'}}>
                    {/* Menggunakan deskripsi dari genre jika buku tidak ada deskripsi khusus, atau teks default */}
                    {book.description || "Sinopsis belum tersedia untuk buku ini."}
                  </p>
              </div>

              {/* Spesifikasi Buku */}
              <h5 className="mb-3 fw-bold border-bottom pb-2">Detail Spesifikasi</h5>
              <div className="table-responsive">
                <table className="table table-borderless table-sm text-secondary">
                    <tbody>
                    <tr>
                        <td style={{ width: '150px' }}>Penulis</td>
                        <td className="fw-semibold text-dark">: {book.author?.nama || "-"}</td>
                    </tr>
                    <tr>
                        <td>ISBN</td>
                        <td className="fw-semibold text-dark">: {book.isbn || "-"}</td>
                    </tr>
                    <tr>
                        <td>Penerbit</td>
                        <td className="fw-semibold text-dark">: {book.penerbit || "-"}</td>
                    </tr>
                    <tr>
                        <td>Tahun Terbit</td>
                        <td className="fw-semibold text-dark">: {book.tahun_terbit || "-"}</td>
                    </tr>
                    <tr>
                        <td>Fisik</td>
                        <td className="fw-semibold text-dark">: {book.hal || "-"} hlm / {book.ukuran || "-"}</td>
                    </tr>
                    <tr>
                        <td>Material</td>
                        <td className="fw-semibold text-dark">: Cover {book.kertas_cover}, Isi {book.kertas_isi}</td>
                    </tr>
                    <tr>
                        <td>Stok</td>
                        <td className="fw-bold text-primary">: {book.catatan || "0"} Buku Tersedia</td>
                    </tr>
                    </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-top">
                  <button 
                    className="btn btn-primary btn-lg w-100 shadow-sm fw-bold py-3 rounded-3"
                    onClick={() => addToCart(book.id)}
                  >
                    + Masukkan Keranjang
                  </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default DetailBook;