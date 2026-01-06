import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { showBooks } from "../_services/book";

const DetailBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        //service showBooks mengambil semua data yang diperlukan
        const response = await showBooks(id);
        setBook(response);
      } catch (error) {
        console.error("Gagal memuat detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <main className="min-vh-100 bg-light">
      <Navbar />
      
      <div className="container py-5">
        <button 
          className="btn btn-outline-secondary mb-4" 
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
          <div className="alert alert-warning text-center">
            Buku tidak ditemukan.
          </div>
        ) : (
          <div className="row bg-white p-4 shadow-sm rounded">
            {/* Kolom Kiri: Cover Buku */}
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <img
                src={`http://127.0.0.1:8000/storage/${book.cover_buku}`}
                alt={book.judul}
                className="img-fluid rounded shadow"
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />
            </div>
            
            {/* Kolom Kanan: Detail & Deskripsi */}
            <div className="col-md-8">
              <h1 className="fw-bold">{book.judul}</h1>
              <h3 className="text-primary fw-bold mb-3">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(book.harga)}
              </h3>
              <hr />

              {/* Deskripsi */}
              <p className="text-muted mb-1"><strong>Deskripsi:</strong></p>
              <p className="text-secondary mb-4">
                {book.description || "Tidak ada deskripsi tersedia."}
              </p>

              {/* Spesifikasi Buku dalam Tabel */}
              <h4 className="mt-4 mb-2">Spesifikasi</h4>
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <td className="fw-semibold" style={{ width: '30%' }}>Penulis</td>
                    <td>{book.author?.nama || "Anonim"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Kategori</td>
                    <td>{book.kategori?.kategori || "-"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">ISBN</td>
                    <td>{book.isbn || "-"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Penerbit</td>
                    <td>{book.penerbit || "-"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Tahun Terbit</td>
                    <td>{book.tahun_terbit || "-"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Halaman / Ukuran</td>
                    <td>{book.hal || "-"} halaman / {book.ukuran || "-"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Kertas Cover & Isi</td>
                    <td>{book.kertas_cover || "-"} & {book.kertas_isi || "-"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Warna Cover & Isi</td>
                    <td>{book.warna_cover || "-"} & {book.warna_isi || "-"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Stok Tersedia</td>
                    <td>{book.stok || "0"} Buku</td>
                  </tr>
                </tbody>
              </table>

              <button className="btn btn-primary btn-lg w-100 mt-4 shadow-sm">
                <i className="bi bi-cart-plus me-2"></i>+ Masukkan Keranjang
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default DetailBook;
