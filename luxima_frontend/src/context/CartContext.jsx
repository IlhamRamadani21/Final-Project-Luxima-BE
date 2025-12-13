import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Inisialisasi cart dari localStorage agar tidak hilang saat refresh browser
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Setiap kali cart berubah, simpan otomatis ke localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Fungsi Tambah ke Keranjang
    const addToCart = (book) => {
        setCart((prevCart) => {
            // Opsional: Cek apakah buku sudah ada, jika ya mungkin tambah quantity (logic sederhana dulu: tambah item baru)
            return [...prevCart, book];
        });
        alert('Berhasil masuk keranjang!');
    };

    // Fungsi Hapus dari Keranjang (berdasarkan index atau ID)
    const removeFromCart = (index) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    };

    // Fungsi Clear Cart (setelah checkout)
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    // Data dan fungsi yang akan disebar
    const value = {
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount: cart.length
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};