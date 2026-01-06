import React, { useEffect, useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, MapPin, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const Cart = () => {
   const [cartItems, setCartItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [address, setAddress] = useState("");
   const [isCheckingOut, setIsCheckingOut] = useState(false);
   
   const navigate = useNavigate();
   const { refreshCart } = useCart();

   // Ambil Data Cart
   const fetchCart = async () => {
      try {
         const response = await api.get("/carts");
         setCartItems(response.data.data || []);
      } catch (error) {
         console.error("Gagal mengambil data cart", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchCart();
   }, []);

   // Update Jumlah
   const updateQuantity = async (id, newQty) => {
      if (newQty < 1) return;
      try {
         setCartItems((prev) => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
         await api.patch(`/carts/${id}`, { quantity: newQty });
         refreshCart(); // Sync Navbar
      } catch (error) {
         fetchCart();
         alert(error.response?.data?.message || "Gagal update stok");
      }
   };

   // Hapus Item
   const deleteItem = async (id) => {
      if (!window.confirm("Hapus buku ini dari keranjang?")) return;
      try {
         await api.delete(`/carts/${id}`);
         setCartItems((prev) => prev.filter((item) => item.id !== id));
         refreshCart(); // Sync Navbar
      } catch (err) {
         console.error(err);
         alert("Gagal menghapus item.");
      }
   };

   const calculateTotal = () => {
      return cartItems.reduce((total, item) => {
         const harga = item.book?.harga || 0;
         return total + harga * item.quantity;
      }, 0);
   };

   // PROSES CHECKOUT
   const handleCheckout = async () => {
       if (!address.trim()) {
           return alert("Mohon isi alamat pengiriman terlebih dahulu.");
       }
       
       if (!window.confirm("Pastikan pesanan sudah benar. Lanjut ke pembayaran?")) return;

       setIsCheckingOut(true);
       try {
           const response = await api.post('/checkout', {
               shipping_address: address
           });
           
           // Refresh cart global agar Navbar jadi 0
           await refreshCart(); 

           alert("Pesanan berhasil dibuat!");
           navigate(`/orders/${response.data.order_id}`); 
           
       } catch (error) {
           console.error(error);
           const msg = error.response?.data?.message || "Checkout gagal.";
           alert(msg);
       } finally {
           setIsCheckingOut(false);
       }
   };

   return (
      <div className="bg-light min-vh-100 font-sans">
         <Navbar />
         
         <div className="container py-5">
            <h2 className="h3 fw-bold mb-4 d-flex align-items-center text-dark">
               <ShoppingCart className="me-3 text-primary" /> Keranjang Belanja
            </h2>

            {loading ? (
               <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3"></div>
                  <p className="text-muted">Memuat keranjang...</p>
               </div>
            ) : cartItems.length === 0 ? (
               <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                  <div className="text-muted opacity-25 mb-3"><ShoppingCart size={64}/></div>
                  <h4>Keranjang Anda kosong</h4>
                  <p className="text-muted mb-4">Yuk cari buku favoritmu sekarang!</p>
                  <Link to="/" className="btn btn-primary px-4 fw-bold">Mulai Belanja</Link>
               </div>
            ) : (
               <div className="row g-4">
                  <div className="col-lg-8">
                     <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-0">
                           {cartItems.map((item) => (
                              <div className="p-4 border-bottom d-flex flex-column flex-md-row align-items-center gap-4" key={item.id}>
                                 <img 
                                    src={item.book?.cover_buku ? `http://127.0.0.1:8000/storage/${item.book.cover_buku}` : "https://via.placeholder.com/80x120"} 
                                    className="rounded shadow-sm object-fit-cover" 
                                    alt="cover"
                                    style={{width: '80px', height: '110px'}}
                                 />

                                 <div className="flex-grow-1 text-center text-md-start">
                                    <h6 className="fw-bold text-dark mb-1">{item.book?.judul}</h6>
                                    <p className="text-primary fw-bold mb-2">Rp {Number(item.book?.harga).toLocaleString('id-ID')}</p>
                                    <div className="text-muted small">Sisa Stok: {item.book?.catatan || 0}</div>
                                 </div>

                                 <div className="d-flex align-items-center bg-light rounded-pill px-2 py-1 border">
                                    <button className="btn btn-sm btn-link text-dark p-1" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14}/></button>
                                    <span className="fw-bold px-2" style={{minWidth: '30px', textAlign: 'center'}}>{item.quantity}</span>
                                    <button className="btn btn-sm btn-link text-dark p-1" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14}/></button>
                                 </div>

                                 <button 
                                    className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center" 
                                    style={{width: '32px', height: '32px', padding: 0}}
                                    onClick={() => deleteItem(item.id)} 
                                    title="Hapus"
                                 >
                                    <Trash2 size={16}/>
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="col-lg-4">
                     <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: "100px" }}>
                        <div className="card-body p-4">
                           <h5 className="fw-bold mb-4">Ringkasan Pesanan</h5>
                           <div className="mb-4">
                               <label className="form-label fw-semibold small text-secondary">
                                   <MapPin size={14} className="me-1"/> Alamat Pengiriman
                               </label>
                               <textarea 
                                   className="form-control bg-light" 
                                   rows="3" 
                                   placeholder="Jln. Mawar No. 12, Jakarta..."
                                   value={address}
                                   onChange={(e) => setAddress(e.target.value)}
                               ></textarea>
                           </div>
                           <hr className="text-secondary opacity-25 my-4" />
                           <div className="d-flex justify-content-between mb-2 text-secondary">
                              <span>Total Barang</span>
                              <span>{cartItems.length} items</span>
                           </div>
                           <div className="d-flex justify-content-between mb-4">
                              <span className="fw-bold text-dark">Total Harga</span>
                              <span className="h5 fw-bold text-primary">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                           </div>
                           <button 
                               onClick={handleCheckout} 
                               disabled={isCheckingOut || cartItems.length === 0}
                               className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center"
                           >
                               {isCheckingOut ? 'Memproses...' : <>Lanjut Pembayaran <ArrowRight size={18} className="ms-2"/></>}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default Cart;