import Navbar from '../components/Navbar';

const About = () => {

    return (
        <div className="d-flex flex-column min-vh-100" style={{backgroundColor: '#f9f9f9', fontFamily: 'Segoe UI, sans-serif'}}>
             
            {/* HEADER FULL WIDTH */}
            <Navbar/> 

            {/* KONTEN UTAMA FULL WIDTH (Diperbarui agar sama dengan Kategori) */}
            <div className="container-fluid px-5 my-5">
                <div className="row justify-content-center text-center">
                    <div className="col-lg-10">
                        <h2 className="fw-bold mb-4">Luxima Metro Media</h2>
                        <p className="lead text-secondary" style={{fontSize: '16px', lineHeight: '1.8', textAlign: 'justify'}}>
                            Hadir sebagai penerbit dan distributor yang berdedikasi tinggi terhadap kemajuan dunia pendidikan dan peningkatan literasi bangsa. Berawal dari keyakinan bahwa fondasi pendidikan yang kuat dimulai sejak usia dini, kami memposisikan diri sebagai mitra terpercaya bagi para pendidik, orang tua, dan institusi.
                        </p>
                        <p className="lead text-secondary mt-3" style={{fontSize: '16px', lineHeight: '1.8', textAlign: 'justify'}}>
                            Perjalanan kami didorong oleh standar kualitas yang tidak kompromi, memastikan bahwa setiap judul — mulai dari buku Pembelajaran yang terstruktur hingga buku Non Fiksi dan Sains yang mendalam — disajikan dengan akurasi data, desain yang menarik, dan material fisik (seperti jenis kertas dan warna cetakan) yang unggul.
                        </p>
                    </div>
                </div>
            </div>

            {/* FOOTER FULL WIDTH */}
            <footer className="text-white pt-5 pb-4 mt-auto" style={{ backgroundColor: '#1a252f' }}>
                <div className="container-fluid px-5 text-center">
                    <p className="small text-secondary">© 2025 Luxima Bookstore. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default About;