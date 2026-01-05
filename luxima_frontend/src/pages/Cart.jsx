import React, { useEffect, useState } from "react";
// ini package icon fungsinya cuman secara untuk icon doang
import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";

// Data keranjang belanja ecek ecek
// const initialCartItems = [
//   { id: 1, judul: 'Adab di Dalam Rumah', harga: 150000, jumlah: 2, stock: 10, imageUrl: "Adab_di_Dalam_Rumah.jpg" },
//   { id: 2, judul: 'Ayo Mengenal Huruf Sambil Mewarnai', harga: 750000, jumlah: 1, stock: 5, imageUrl: "Ayo_Mengenal_Huruf_Sambil_Mewarnai.jpg" },
//   { id: 3, judul: 'Cara mengajar anak dirumah', harga: 85000, jumlah: 3, stock: 25, imageUrl: "Cara mengajar_anak_dirumah.jpg" },
// ];

// // Fungsi untuk memformat angka menjadi Rupiah
// const formatRupiah = (number) => {
//   return new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR',
//     minimumFractionDigits: 0,
//   }).format(number);
// };

// Komponen Utama Keranjang Belanja

const Cart = () => {
   const [cartItems, setCartItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const token = localStorage.getItem("token");

   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
         Accept: "application/json",
      },
   };

   // 1. Ambil Data - Pindahkan setLoading ke dalam try/catch
   const fetchCart = async () => {
      try {
         const response = await axios.get("http://localhost:8000/api/carts", config);
         // Pastikan struktur response.data.data sesuai dengan backend Laravel
         setCartItems(response.data.data || response.data);
      } catch (error) {
         console.error("Gagal mengambil data", error);
      } finally {
         setLoading(false); // Pastikan loading berhenti apa pun hasilnya
      }
   };

   useEffect(() => {
      fetchCart();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // 2. Update Jumlah - Perbaikan: Gunakan 'prev' agar tidak cascading
   const updateQuantity = async (id, newQty) => {
      if (newQty < 1) return;
      try {
         await axios.patch(`http://localhost:8000/api/carts/${id}`, { quantity: newQty }, config);

         // PERBAIKAN DI SINI: Menggunakan functional update (prev)
         setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
      } catch (error) {
         alert(error.response?.data?.message || "Gagal update stok");
      }
   };

   // 3. Hapus Item - Perbaikan: Gunakan 'prev' agar tidak error unused/stale
   const deleteItem = async (id) => {
      if (window.confirm("Hapus buku ini dari keranjang?")) {
         try {
            await axios.delete(`http://localhost:8000/api/carts/${id}`, config);
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
         } catch (err) {
            // Ubah nama jadi err agar jelas
            console.error(err); // Cetak ke console agar tahu penyebab asli errornya
            alert("Gagal menghapus item: " + (err.response?.data?.message || "Koneksi bermasalah"));
         }
      }
   };

   // Perbaikan: Tambahkan optional chaining (?.) agar tidak crash jika data belum load
   const calculateTotal = () => {
      return cartItems.reduce((total, item) => {
         const harga = item.book?.harga || 0;
         return total + harga * item.quantity;
      }, 0);
   };

   return (
      <div
         style={{
            backgroundColor: "#f9f9f9",
            minHeight: "100vh",
            fontFamily: "Segoe UI, sans-serif",
         }}
      >
         <Navbar />
         {loading ? (
            <div className="text-center py-5">
               <div className="spinner-border text-primary mb-3"></div>
               <h5>Memuat Keranjang...</h5>
            </div>
         ) : (
            <div className="container mt-5">
               <h2 className="mb-4 d-flex align-items-center">
                  <i className="bi bi-cart3 me-2"></i> Keranjang Belanja
               </h2>

               {cartItems.length === 0 ? (
                  <div className="alert alert-info border-0 shadow-sm">Keranjang Anda kosong.</div>
               ) : (
                  <div className="row g-4">
                     {/* Daftar Item */}
                     <div className="col-lg-8">
                        {cartItems.map((item) => (
                           <div className="card mb-3 shadow-sm border-0" key={item.id}>
                              <div className="card-body">
                                 <div className="row align-items-center g-3">
                                    {/* Gambar: Responsive Size */}
                                    <div className="col-4 col-md-2">
                                       <img src={`http://localhost:8000/storage/${item.book.cover}`} className="img-fluid rounded shadow-sm" alt="cover" />
                                    </div>

                                    {/* Judul & Harga: Auto space */}
                                    <div className="col-8 col-md-4">
                                       <h6 className="mb-1 text-truncate">{item.book.judul}</h6>
                                       <p className="text-primary fw-bold mb-0">Rp {item.book.harga.toLocaleString()}</p>
                                    </div>

                                    {/* Kontrol Jumlah */}
                                    <div className="col-6 col-md-3 d-flex align-items-center justify-content-md-center">
                                       <div className="input-group input-group-sm" style={{ width: "100px" }}>
                                          <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                             -
                                          </button>
                                          <span className="input-group-text bg-white fw-bold">{item.quantity}</span>
                                          <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                             +
                                          </button>
                                       </div>
                                    </div>

                                    {/* Subtotal & Hapus */}
                                    <div className="col-6 col-md-3 text-end">
                                       <div className="fw-bold text-dark d-md-block mb-1">Rp {(item.book.harga * item.quantity).toLocaleString()}</div>
                                       <button className="btn btn-link text-danger p-0 text-decoration-none" onClick={() => deleteItem(item.id)}>
                                          <i className="bi bi-trash me-1"></i> Hapus
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Ringkasan Belanja: Sticky on Scroll */}
                     <div className="col-lg-4">
                        <div className="card shadow-sm border-0 sticky-top" style={{ top: "20px" }}>
                           <div className="card-body">
                              <h5 className="card-title mb-4">Ringkasan Belanja</h5>
                              <div className="d-flex justify-content-between mb-2">
                                 <span className="text-muted">Total Barang</span>
                                 <span>{cartItems.length} items</span>
                              </div>
                              <div className="d-flex justify-content-between mb-4">
                                 <span className="h6">Total Harga</span>
                                 <span className="h5 fw-bold text-primary">Rp {calculateTotal().toLocaleString()}</span>
                              </div>
                              <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm">Lanjut Pembayaran</button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default Cart;
