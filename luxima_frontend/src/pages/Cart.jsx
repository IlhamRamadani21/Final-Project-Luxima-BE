import React, { useState } from 'react'; 
// ini package icon fungsinya cuman secara untuk icon doang
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react'; 
import Navbar from '../components/Navbar';

// Data keranjang belanja ecek ecek
const initialCartItems = [
  { id: 1, judul: 'Adab di Dalam Rumah', harga: 150000, jumlah: 2, stock: 10, imageUrl: "Adab_di_Dalam_Rumah.jpg" },
  { id: 2, judul: 'Ayo Mengenal Huruf Sambil Mewarnai', harga: 750000, jumlah: 1, stock: 5, imageUrl: "Ayo_Mengenal_Huruf_Sambil_Mewarnai.jpg" },
  { id: 3, judul: 'Cara mengajar anak dirumah', harga: 85000, jumlah: 3, stock: 25, imageUrl: "Cara mengajar_anak_dirumah.jpg" },
];

// Fungsi untuk memformat angka menjadi Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

// Komponen Utama Keranjang Belanja
const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Perhitungan Subtotal dan Total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.harga * item.jumlah), 0);
  };

  // Handler untuk menambah kuantitas
  const handleTambahJumlahPesanan = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.jumlah < item.stock
          ? { ...item, jumlah: item.jumlah + 1 }
          : item
      )
    );
  };

  // Handler untuk mengurangi kuantitas
  const handleKurangiJumlahPesanan = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.jumlah > 1
          ? { ...item, jumlah: item.jumlah - 1 }
          : item
      )
    );
  };

  // Handler untuk menghapus item
  const handleHapusItemPesanan = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Status keranjang kosong
  const isCartEmpty = cartItems.length === 0;
  const subTotal = calculateTotal();
  const biayaPengiriman = isCartEmpty ? 0 : 25000;
  const totalBiaya = subTotal + biayaPengiriman;


  // Component untuk menampilkan satu produk item keranjang
  const CartItem = ({ item }) => (
    <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
      {/* Gambar & Detail Produk */}
      <div className="d-flex align-items-center flex-grow-1">
        <img
          src={item.imageUrl}
          alt={item.judul}
          style={{ width: '80px', height: '80px' }} // ukurannya secara eksplisit
          className="rounded me-4 shadow-sm object-fit-cover"
        />
        <div className="flex-grow-1">
          <h3 className="fw-semibold text-dark fs-5">{item.judul}</h3>
          <p className="small text-muted mb-0">Stok tersisa: {item.stock}</p>
        </div>
      </div>

      {/* Kontrol jumlah pemesanan */}
      <div className="d-flex align-items-center gap-2 mx-3 mx-sm-5">
        <button
          onClick={() => handleKurangiJumlahPesanan(item.id)}
          disabled={item.jumlah <= 1}
          className="btn btn-outline-secondary btn-sm rounded-circle p-1"
          aria-label="Kurangi Kuantitas"
        >
          <Minus size={16} />
        </button>
        <span className="fw-medium text-center" style={{ width: '2rem' }}>{item.jumlah}</span>
        <button
          onClick={() => handleTambahJumlahPesanan(item.id)}
          disabled={item.jumlah >= item.stock}
          className="btn btn-outline-secondary btn-sm rounded-circle p-1"
          aria-label="Tambah Kuantitas"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Harga & Hapus */}
      <div className="text-end" style={{ width: '150px' }}>
        <p className="fw-bold fs-5 text-primary mb-0">{formatRupiah(item.harga * item.jumlah)}</p>
        <p className="small text-muted mb-0">({formatRupiah(item.harga)}/item)</p>
      </div>

      <button
        onClick={() => handleHapusItemPesanan(item.id)}
        className="ms-3 btn btn-link text-danger p-1"
        aria-label="Hapus Item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );

  return (
    <div className="d-flex flex-column min-vh-100 w-100" style={{backgroundColor: '#f9f9f9', fontFamily: 'Segoe UI, sans-serif', overflowX: 'hidden'}}>
      <Navbar/>
      <div className="container-fluid px-4 my-5 w-100" style={{maxWidth: '100%'}}>
        <h1 className="h1 fw-bolder text-dark mb-4 d-flex align-items-center">
          <ShoppingCart className="me-3 text-primary" size={32} />
          Keranjang Belanja Anda
        </h1>

        <div className="row g-4">
          {/* tampilan daftar item buku*/}
          <div className="col-lg-8">
            <div className="bg-white shadow-lg rounded-3 overflow-hidden">
              <div className="p-4">
                {isCartEmpty ? (
                  <div className="text-center py-5 bg-light rounded-3 border border-secondary border-opacity-50">
                    <X className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="fs-4 fw-semibold text-muted mb-2">Keranjang Anda Kosong</p>
                    <p className="text-secondary mt-2">Yuk, segera temukan produk favorit Anda!</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {cartItems.map(item => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
              {!isCartEmpty && (
                <div className="p-4 bg-light border-top d-flex justify-content-between align-items-center">
                  <button className="d-flex align-items-center small fw-semibold text-primary btn btn-link p-0">
                    <Plus size={16} className="me-1"/> Lanjutkan Belanja
                  </button>
                  <button 
                    onClick={() => setCartItems([])}
                    className="d-flex align-items-center small fw-semibold text-danger btn btn-link p-0"
                  >
                    <Trash2 size={16} className="me-1"/> Kosongkan Keranjang
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* tampilan biaya pesanan */}
          <div className="col-lg-4">
            <div className="position-sticky" style={{ top: '1.5rem' }}>
              <div className="bg-white shadow-lg rounded-3 p-4 border-top border-primary border-5">
                <h2 className="h4 fw-bold text-dark mb-4 border-bottom pb-3">Ringkasan Pesanan</h2>

                <div className="d-grid gap-3">
                  <div className="d-flex justify-content-between text-muted">
                    <span>Subtotal ({cartItems.length} item)</span>
                    <span>{formatRupiah(subTotal)}</span>
                  </div>

                  <div className="d-flex justify-content-between text-muted border-bottom pb-3">
                    <span>Biaya Pengiriman</span>
                    <span>{formatRupiah(biayaPengiriman)}</span>
                  </div>

                  <div className="d-flex justify-content-between fw-bolder fs-4 text-dark pt-2">
                    <span>Total Keseluruhan</span>
                    <span className="text-primary">{formatRupiah(totalBiaya)}</span>
                  </div>
                </div>

                <button
                  disabled={isCartEmpty}
                  className="w-100 mt-4 py-3 btn btn-primary fw-semibold rounded-3 shadow-sm"
                >
                  Lanjutkan ke Pembayaran
                </button>
                
                <p className="small text-muted mt-3 text-center mb-0">
                  Belum termasuk PPN & diskon tambahan.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
        {/* 5. FOOTER (FULL WIDTH) */}
            <footer className="text-white pt-5 pb-4 mt-10 w-100" style={{ backgroundColor: '#1a252f'}}>
                <div className="container-fluid px-4 w-100">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <h5 className="fw-bold mb-3">Luxima</h5>
                            <p className="small text-secondary lh-lg">
                                Toko buku online terlengkap dengan pengalaman belanja yang nyaman dan menyenangkan.
                            </p>
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
                    <div className="text-center mt-5 pt-3 border-top border-secondary small text-secondary">
                        &copy; 2025 Luxima Bookstore. All rights reserved.
                    </div>
                </div>
            </footer>
    </div>
  );
}

export default Cart;