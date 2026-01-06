import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../api";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
   // Kita simpan array lengkap, bukan cuma jumlah
   const [cart, setCart] = useState([]);
   const [cartCount, setCartCount] = useState(0);

   // Fungsi fetch data terbaru dari server
   const refreshCart = useCallback(async () => {
      const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

      // Jika tidak ada token (belum login), kosongkan cart
       if (!token) {
            setCart([]);
            setCartCount(0);
            return;
        }

        // Cek Role
        // Jika user adalah ADMIN, jangan panggil API cart
        if (user && user.role === 'admin') {
            setCart([]);
            setCartCount(0);
            return;
        }

        try {
            const response = await api.get('/carts');
            const items = response.data.data || [];
            
            setCart(items);
            
            const total = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
            setCartCount(total);
        } catch (error) {
            // Suppress error 403 agar tidak memenuhi console jika kebetulan lolos
            if (error.response && error.response.status === 403) {
                return;
            }
            console.error("Gagal sinkronisasi keranjang:", error);
        }
    }, []);

   // Load cart saat aplikasi pertama kali dibuka (mount)
   useEffect(() => {
      const loadCart = async () => {
         await refreshCart();
      };

      loadCart();
   }, [refreshCart]);

   // Fungsi Add to Cart (Global Wrapper)
   const addToCart = async (bookId, qty = 1) => {
      const token = localStorage.getItem("token");

      // Cek Login
      if (!token) {
         alert("Silakan login terlebih dahulu untuk berbelanja.");
         window.location.href = "/login";
         return false;
      }

      try {
         // Kirim Request
         await api.post("/carts", {
            book_id: bookId,
            quantity: qty,
         });

         // Refresh Data Cart agar Navbar update
         await refreshCart();
         alert("Berhasil masuk keranjang!");
         return true;
      } catch (error) {
         // Debug Error yang lebih jelas
         console.error(
            "Gagal tambah ke keranjang:",
            error.response?.data || error.message
         );
         alert(error.response?.data?.message || "Gagal menambahkan buku.");
         return false;
      }
   };

   // Fungsi Logout Helper (Membersihkan state lokal)
   const clearCartLocal = () => {
      setCart([]);
      setCartCount(0);
   };

   return (
      <CartContext.Provider
         value={{ cart, cartCount, refreshCart, addToCart, clearCartLocal }}
      >
         {children}
      </CartContext.Provider>
   );
};
