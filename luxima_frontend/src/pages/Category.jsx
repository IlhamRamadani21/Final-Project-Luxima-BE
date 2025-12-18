import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getSegmentations } from '../_services/segmentations';
import { getCategories } from '../_services/categories';
import { getAuthors } from '../_services/author';
import { getBooks } from '../_services/book';


const Category = () => {
    // --- 1. DATA STRUKTUR KATEGORI ---
    const categoriesData = [
        {
            id: 'usia-dini',
            title: "USIA DINI",
            color: "#FF0000", // Merah Luxima
            subcategories: [
                {
                    name: "PEMBELAJARAN",
                    series: ["SERI PEMBELAJARAN USIA DINI (40 BUKU)"]
                },
                {
                    name: "FIKSI ANAK",
                    series: [
                        "SERI CERITA ANAK USIA DINI (9 BUKU)",
                        "SERI FABEL BERKARAKTER (10 BUKU)",
                        "SERI AKHLAK ANAK MUSLIM (8 BUKU)",
                        "SERI PENSIL NYATA / PENULIS CILIK (5 BUKU)"
                    ]
                },
                {
                    name: "AGAMA",
                    series: ["SERI BELAJAR ISLAM USIA DINI (15 BUKU)"]
                },
                {
                    name: "NON FIKSI ANAK",
                    series: ["SERI FABEL ISLAMI (10 BUKU)"]
                }
            ]
        },
        {
            id: 'anak',
            title: "ANAK",
            color: "#FFC09F", // Peach Luxima
            subcategories: [
                {
                    name: "AGAMA",
                    series: [
                        "SERI BUKU PINTAR ANAK ISLAM (12 BUKU)",
                        "SERI TELADAN ANAK MUSLIM (10 BUKU)",
                        "SERI ADAB ANAK MUSLIM (12 BUKU)",
                        "SERI FIQIH ISLAM PAKET 1 (12 BUKU)",
                        "SERI FIQIH ISLAM PAKET 2 (12 BUKU)"
                    ]
                },
                {
                    name: "SAINS",
                    series: [
                        "SERI SAINS ANAK (15 BUKU)",
                        "SERI DALAM AL-QURAN: KEAJAIBAN LANGIT (15 BUKU)"
                    ]
                },
                {
                    name: "FIKSI ANAK",
                    series: [
                        "SERI NILAI KARAKTER BANGSA (11 BUKU)",
                        "SERI CERDIK BERKATA (5 BUKU)",
                        "SERI MENGENAL TRANSPORTASI UMUM (4 BUKU)",
                        "SERI 1 JELAJAH NUSANTARA (7 BUKU)",
                        "SERI SAYANGI BUMI (5 BUKU)",
                        "BUKU ANAK LAINNYA (6 FIKSI, 2 NON FIKSI, 1 KETERAMPILAN)"
                    ]
                },
                {
                    name: "PENGETAHUAN / SEJARAH",
                    series: [
                        "SERI ILMUAN MUSLIM PAKET 1 (10 BUKU)",
                        "SERI ILMUAN MUSLIM PAKET 2 (10 BUKU)"
                    ]
                },
                {
                    name: "NON FIKSI",
                    series: ["SERI TOKOH PERADABAN ISLAM (10 BUKU)"]
                }
            ]
        },
        {
            id: 'pengayaan-guru',
            title: "PENGAYAAN GURU",
            color: "#5D7B93", // Biru/Teal Luxima
            subcategories: [
                {
                    name: "PENDIDIKAN",
                    series: [
                        "SERI PENGAYAAN GURU USIA DINI (16 BUKU)",
                        "SERI PENGAYAAN GURU PENDIDIKAN INKLUSIF (23 BUKU)"
                    ]
                }
            ]
        }
    ];

    // --- 2. STATE MANAGEMENT ---
    const [activeCategory, setActiveCategory] = useState(categoriesData[0]);
    const [activeSub, setActiveSub] = useState(categoriesData[0].subcategories[0]);
    const [books, setBooks]= useState([]);
    const [authors, setAuthors]= useState([]);
    const [categories, setCategories]= useState([]);
    const [segmentations, setSegmentations]= useState([]);

    useEffect(()=>{

       const fetchData = async ()=>{
            const [booksData, authorsData, categoriesData, segmentationsData] = await Promise.all([getBooks(), getAuthors(), getCategories(), getSegmentations()]);

            setBooks(booksData);
            setAuthors(authorsData);
            setCategories(categoriesData);
            setSegmentations(segmentationsData);
        }
        fetchData();

        },[]);
    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setActiveSub(category.subcategories[0]); 
    };

    console.log(books);
    console.log(authors);
    console.log(categories);
    console.log(segmentations);
    
    return (
        // Wrapper Utama Full Width
        <div className="d-flex flex-column min-vh-100 w-100" style={{backgroundColor: '#f9f9f9', fontFamily: 'Segoe UI, sans-serif', overflowX: 'hidden'}}>
             
            {/* --- 1. TOP HEADER (FULL WIDTH) --- */}
            <Navbar/>
            
            {/* --- 3. KONTEN UTAMA (FULL WIDTH 100%) --- */}
            <div className="container-fluid px-4 my-5 w-100" style={{maxWidth: '100%'}}>
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-uppercase ls-1">Katalog Lengkap</h2>
                    <p className="text-muted">Pilih kategori di bawah untuk menemukan koleksi buku terbaik kami.</p>
                </div>
                
                {/* LEVEL 1: KATEGORI UTAMA */}
                <div className="row g-3 mb-5 w-100 mx-0">
                    {categoriesData.map((cat) => (
                        <div key={cat.id} className="col-md-4">
                            <div 
                                onClick={() => handleCategoryClick(cat)}
                                className="shadow-sm p-4 rounded-3 d-flex align-items-center justify-content-between position-relative overflow-hidden h-100"
                                style={{
                                    backgroundColor: activeCategory.id === cat.id ? cat.color : '#fff',
                                    color: activeCategory.id === cat.id ? '#fff' : '#333',
                                    border: activeCategory.id === cat.id ? 'none' : '1px solid #ddd',
                                    cursor: 'pointer',
                                    minHeight: '100px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <h4 className="fw-bold m-0">{cat.title}</h4>
                                <span style={{fontSize: '24px', opacity: 0.5}}>
                                    {activeCategory.id === cat.id ? '▼' : '▶'}
                                </span>
                                
                                {activeCategory.id === cat.id && (
                                    <div style={{
                                        position: 'absolute', right: -20, bottom: -20, 
                                        width: 100, height: 100, borderRadius: '50%', 
                                        backgroundColor: 'rgba(255,255,255,0.2)'
                                    }}></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* LEVEL 2: SUB-KATEGORI */}
                <div className="mb-4 w-100">
                    <div className="d-flex flex-wrap gap-2 justify-content-center border-bottom pb-3 w-100">
                        {activeCategory.subcategories.map((sub, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveSub(sub)}
                                className={`btn rounded-pill px-4 fw-bold ${activeSub.name === sub.name ? 'shadow-sm' : ''}`}
                                style={{
                                    backgroundColor: activeSub.name === sub.name ? activeCategory.color : '#e9ecef',
                                    color: activeSub.name === sub.name ? '#fff' : '#555',
                                    border: 'none',
                                    transition: '0.2s',
                                    marginBottom: '10px'
                                }}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* LEVEL 3: SERI BUKU (TEMPLATE FULL LAYAR) */}
                {/* W-100 pada div pembungkus dan card memastikan box putih selalu full width */}
                <div className="w-100 animate__animated animate__fadeIn">
                    <div className="card border-0 shadow-sm w-100" style={{minHeight: '200px'}}> 
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="fw-bold mb-0" style={{color: activeCategory.color}}>
                                📂 {activeCategory.title} &gt; {activeSub.name}
                            </h5>
                        </div>
                        <div className="card-body">
                            {activeSub.series.length > 0 ? (
                                <div className="row g-3 w-100 mx-0">
                                    {activeSub.series.map((seri, idx) => (
                                        // Gunakan col-lg-3 agar muat 4 buku per baris. 
                                        // Box putih parent TETAP Full Width walaupun itemnya sedikit.
                                        <div key={idx} className="col-md-6 col-lg-3">
                                            <div 
                                                className="p-3 border rounded d-flex align-items-center gap-3 hover-effect h-100"
                                                style={{cursor: 'pointer', backgroundColor: '#fff', transition: '0.2s'}}
                                            >
                                                <div 
                                                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                                                    style={{width: '50px', height: '50px', backgroundColor: activeCategory.color, flexShrink: 0}}
                                                >
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="fw-bold mb-1 text-dark small">{seri}</h6>
                                                    <div className="d-flex align-items-center gap-2 mt-2">
                                                        <span className="badge bg-light text-secondary border" style={{fontSize: '10px'}}>Tersedia</span>
                                                        <small className="text-primary fw-bold" style={{fontSize: '11px'}}>Lihat Detail &rarr;</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted text-center py-5">Belum ada seri buku di kategori ini.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* 5. FOOTER (FULL WIDTH) */}
            <footer className="text-white pt-5 pb-4 mt-auto w-100" style={{ backgroundColor: '#1a252f' }}>
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

            <style>
                {`
                .hover-effect:hover {
                    transform: translateX(5px);
                    border-color: ${activeCategory.color} !important;
                    background-color: #f8f9fa !important;
                }
                .hover-underline:hover {
                    color: #5D7B93 !important;
                    text-decoration: underline;
                }
                `}
            </style>
        </div>
    );
};

export default Category;