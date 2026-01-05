import React, { useState, useEffect } from "react";
import { getSegmentations } from "../_services/segmentations";
import { getCategories } from "../_services/categories";
import { getBooks } from "../_services/book";
import Navbar from "../components/Navbar";

const Category = () => {
   const [segmentations, setSegmentations] = useState([]);
   const [allCategories, setAllCategories] = useState([]);
   const [filteredCategories, setFilteredCategories] = useState([]);

   // butuh 2 state untuk buku:
   // 1 untuk data asli, 1 nya untuk data yang ditampilkan di render pertama
   const [allBooksMaster, setAllBooksMaster] = useState([]);
   const [books, setBooks] = useState([]);

   const [selectedSegId, setSelectedSegId] = useState("all");
   const [selectedKatId, setSelectedKatId] = useState(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchInitialData = async () => {
         try {
            setLoading(true);
            const [segData, catData, bookData] = await Promise.all([getSegmentations(), getCategories(), getBooks()]);
            setSegmentations(segData);
            setAllCategories(catData);
            setAllBooksMaster(bookData); // Simpan semua buku sebagai cadangan
            setBooks(bookData); // ini untuk data buku di awal aja
         } catch (error) {
            console.error("Gagal memuat data:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchInitialData();
   }, []);

   const handleSegmentationClick = (segId) => {
      setSelectedKatId(null);
      if (segId === "all") {
         setSelectedSegId("all");
         setFilteredCategories([]);
         setBooks(allBooksMaster); // Reset tampilkan semua buku
      } else {
         setSelectedSegId(segId);
         // Filter kategori berdasarkan segmentasi
         const filtered = allCategories.filter((cat) => cat.segmentasi_id === segId);
         setFilteredCategories(filtered);

         // Opsional aja menampilkan buku yang hanya termasuk dalam segmen tersebut
         const booksInSegmen = allBooksMaster.filter((b) => b.segmentasi_id === segId);
         setBooks(booksInSegmen);
      }
   };

   const handleCategoryClick = (katId) => {
      setSelectedKatId(katId);

      // LOGIKA FILTER DISINI:
      // Kita memfilter dari master data buku (allBooksMaster)
      // berdasarkan kategori_id yang diklik
      const booksByKategori = allBooksMaster.filter((buku) => buku.kategori_id === katId);
      setBooks(booksByKategori);
   };

   return (
       <main className="d-flex flex-column min-vh-100 w-100" style={{backgroundColor: '#f9f9f9', fontFamily: 'Segoe UI, sans-serif', overflowX: 'hidden'}}>
         <Navbar />
         <h2 className="text-center my-4 fw-bold fs-2">Katalog Kategori</h2>

         {/* Navigasi Segmentasi */}
         <session className="container-fluid px-4 my-5 w-100" style={{maxWidth: '100%'}}>
            <div className="card-body mx-auto">
               <h6 className="text-muted mb-3">Pilih Segmentasi:</h6>
               <div className="d-flex flex-wrap gap-2 mx-auto">
                  <button onClick={() => handleSegmentationClick("all")} className={`btn ${selectedSegId === "all" ? "btn-dark" : "btn-outline-dark"}`}>
                     Semua
                  </button>
                  {segmentations.map((seg) => (
                     <button key={seg.id} onClick={() => handleSegmentationClick(seg.id)} className={`btn ${selectedSegId === seg.id ? "btn-primary" : "btn-outline-primary"}`}>
                        {seg.segmentasi}
                     </button>
                  ))}
               </div>
               {/* Navigasi Kategori */}
         {selectedSegId && selectedSegId !== "all" && (
            <div className="card shadow-sm mb-4 mx-auto border-0 bg-light animate__animated animate__fadeIn">
               <div className="card-body">
                  <h6 className="text-muted mb-3">Kategori Tersedia:</h6>
                  <div className="d-flex flex-wrap gap-2">
                     {filteredCategories.length > 0 ? (
                        filteredCategories.map((kat) => (
                           <button key={kat.id} onClick={() => handleCategoryClick(kat.id)} className={`btn btn-sm ${selectedKatId === kat.id ? "btn-success" : "btn-outline-success"}`}>
                              {kat.kategori}
                           </button>
                        ))
                     ) : (
                        <div className="alert alert-info w-100 py-2 small">Tidak ada kategori.</div>
                     )}
                  </div>
               </div>
            </div>
         )}
            </div>
         </session>
         {/* Daftar Buku */}
         <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            <div className="col-12">
               <h5 className="fw-bold mb-3">
                  {selectedSegId === "all" ? "Menampilkan Semua Buku" : "Hasil Pencarian"}
                  {loading && <span className="ms-2 spinner-border spinner-border-sm text-primary"></span>}
               </h5>
            </div>

            {books.length > 0
               ? books.map((buku) => (
                    <div key={buku.id} className="col-sm-6 col-md-4 col-lg-3">
                       <div className="card"style={{width: "18rem"}}>
                        <img src={"#"} className="card-img-top" alt={buku.judul}/>

                          <div className="card-body">
                             <h6 className="card-title fw-bold text-dark">{buku.judul}</h6>
                             <p className="card-text">{buku.description}</p>
                             <h5 className="text-success mt-3">Rp. {buku.harga}</h5>
                          </div>
                          <div className="card-footer bg-white border-0 pb-3">
                             <button className="btn btn-outline-primary btn-sm w-100">Detail</button>
                             <button className="btn btn-outline-primary btn-sm w-100">Add to Cart</button>
                          </div>
                       </div>
                    </div>
                 ))
               : !loading && <div className="text-center py-5 text-muted col-12">Tidak ada buku ditemukan.</div>}
         </div>
      </main>
   );
};

export default Category;
