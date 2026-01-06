import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, AlertCircle } from 'lucide-react';
import api from '../../api';

const BookForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    // State Data Dropdown
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [segmentations, setSegmentations] = useState([]);

    // State Form
    const [formData, setFormData] = useState({
        judul: '',
        isbn: '',
        harga: '',
        penerbit: '',
        tahun_terbit: '',
        hal: '',
        ukuran: '',
        author_id: '',
        kategori_id: '',
        segmentasi_id: '',
        cover_buku: null,
        kertas_cover: '',
        kertas_isi: '',
        warna_cover: '',
        warna_isi: '',
        tgl_surat_keputusan: '',
        no_surat_puskurbuk: '',
        catatan: '', 
    });

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // State Error (Inisialisasi dengan Objek Kosong agar tidak undefined)
    const [globalError, setGlobalError] = useState(null); 
    const [validationErrors, setValidationErrors] = useState({}); 

    // 1. Fetch Dropdowns
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [resAuthor, resGenre, resSeg] = await Promise.all([
                    api.get('/authors'),
                    api.get('/genres'),
                    api.get('/segmentations')
                ]);
                setAuthors(resAuthor.data.data || resAuthor.data);
                setGenres(resGenre.data.data || resGenre.data);
                setSegmentations(resSeg.data.data || resSeg.data);
            } catch (err) {
                console.log(err);
                setGlobalError("Gagal memuat data kategori/penulis. Cek koneksi server.");
            }
        };
        fetchDropdowns();
    }, []);

    // 2. Fetch Data Buku (Edit Mode)
    useEffect(() => {
        if (isEdit) {
            const fetchBook = async () => {
                try {
                    const { data } = await api.get(`/books/${id}`);
                    const book = data.data;
                    
                    setFormData({
                        judul: book.judul || '',
                        isbn: book.isbn || '',
                        harga: book.harga || '',
                        stok: book.stok || '',
                        penerbit: book.penerbit || '',
                        tahun_terbit: book.tahun_terbit || '',
                        hal: book.hal || '',
                        ukuran: book.ukuran || '',
                        author_id: book.author_id || '',
                        kategori_id: book.kategori_id || '',
                        segmentasi_id: book.segmentasi_id || '',
                        kertas_cover: book.kertas_cover || '',
                        kertas_isi: book.kertas_isi || '',
                        warna_cover: book.warna_cover || '',
                        warna_isi: book.warna_isi || '',
                        tgl_surat_keputusan: book.tgl_surat_keputusan || '',
                        no_surat_puskurbuk: book.no_surat_puskurbuk || '',
                        catatan: book.catatan || '',
                        cover_buku: null
                    });

                    if (book.cover_buku) {
                        setPreview(`http://127.0.0.1:8000/storage/${book.cover_buku}`);
                    }
                } catch (error) {
                    console.log(error);
                    setGlobalError('Gagal mengambil data buku untuk diedit.');
                }
            };
            fetchBook();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Hapus error field saat user mengetik (Safe Check)
        if (validationErrors && validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, cover_buku: file }));
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
        if (validationErrors && validationErrors['cover_buku']) {
            setValidationErrors(prev => ({ ...prev, cover_buku: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setGlobalError(null);
        setValidationErrors({}); 

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '' && key !== 'cover_buku') {
                data.append(key, formData[key]);
            }
        });
        if (formData.cover_buku) {
            data.append('cover_buku', formData.cover_buku);
        }

        try {
            if (isEdit) {
                data.append('_method', 'PUT');
                await api.post(`/books/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/books', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/admin/books');
        } catch (error) {
            console.error("Error submit:", error);
            
            if (error.response && error.response.status === 422) {
                // AMBIL LIST ERROR
                const errorData = error.response.data?.errors || error.response.data?.data || {};
                
                // Set error per field
                setValidationErrors(errorData);

                // Set error global
                const errorMessages = Object.values(errorData).flat();

                if (errorMessages.length > 0) {
                    // Jika errornya cuma 1, tampilkan langsung teksnya
                    if (errorMessages.length === 1) {
                        setGlobalError(errorMessages[0]);
                    } else {
                        // Jika banyak, tampilkan sebagai list HTML
                        setGlobalError(
                            <ul className="mb-0 ps-3">
                                {errorMessages.map((msg, index) => (
                                    <li key={index}>{msg}</li>
                                ))}
                            </ul>
                        );
                    }
                } else {
                    // Fallback jika array kosong tapi status 422
                    setGlobalError(error.response.data?.message || "Terdapat kesalahan validasi.");
                }

                window.scrollTo(0, 0);
            } else {
                // Error 500 atau lainnya
                setGlobalError(error.response?.data?.message || 'Terjadi kesalahan sistem.');
                window.scrollTo(0, 0);
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper Component untuk Pesan Error Field (Safe Check)
    const FieldError = ({ fieldName }) => {
        // Cek dulu apakah validationErrors ada, baru cek fieldName
        if (validationErrors && validationErrors[fieldName]) {
            return (
                <div className="text-danger small mt-1 d-flex align-items-center">
                    <AlertCircle size={12} className="me-1" />
                    {/* Ambil pesan error pertama */}
                    {validationErrors[fieldName][0]}
                </div>
            );
        }
        return null;
    };

    // Helper untuk Class Input Invalid (Safe Check)
    const isInvalid = (fieldName) => {
        return validationErrors && validationErrors[fieldName] ? 'is-invalid' : '';
    }

    return (
        <div className="container-fluid px-4 py-4 bg-light min-vh-100 font-sans">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                    <Link to="/admin/books" className="btn btn-outline-secondary rounded-circle p-2">
                        <ArrowLeft size={20} />
                    </Link>
                    <h2 className="h3 fw-bold text-dark m-0">{isEdit ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>
                </div>
            </div>

            {/* Global Error Alert */}
            {globalError && (
                <div className="alert alert-danger d-flex align-items-center shadow-sm rounded-3 mb-4" role="alert">
                    <AlertCircle className="me-2" size={20} />
                    <div>{globalError}</div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    {/* KOLOM KIRI: Informasi Utama */}
                    <div className="col-lg-8">
                        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                            <div className="card-header bg-white border-bottom py-3 px-4">
                                <h5 className="m-0 fw-bold text-primary">Informasi Buku</h5>
                            </div>
                            <div className="card-body p-4">
                                
                                {/* Judul */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-secondary">Judul Buku <span className="text-danger">*</span></label>
                                    <input 
                                        type="text" 
                                        name="judul" 
                                        className={`form-control form-control-lg ${isInvalid('judul')}`} 
                                        placeholder="Masukkan judul buku..." 
                                        value={formData.judul} 
                                        onChange={handleChange} 
                                    />
                                    <FieldError fieldName="judul" />
                                </div>

                                <div className="row g-3">
                                    {/* ISBN */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-secondary">ISBN <span className="text-danger">*</span></label>
                                        <input type="text" name="isbn" className={`form-control ${isInvalid('isbn')}`} placeholder="Contoh: 978-..." value={formData.isbn} onChange={handleChange} />
                                        <FieldError fieldName="isbn" />
                                    </div>
                                    {/* Harga */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-secondary">Harga (Rp) <span className="text-danger">*</span></label>
                                        <input type="number" name="harga" className={`form-control ${isInvalid('harga')}`} placeholder="0" value={formData.harga} onChange={handleChange} />
                                        <FieldError fieldName="harga" />
                                    </div>
                                    {/* Stok */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-secondary">Stok <span className="text-danger">*</span></label>
                                        <input type="number" name="stok" className={`form-control ${isInvalid('stok')}`} placeholder="0" value={formData.stok} onChange={handleChange} />
                                        <FieldError fieldName="stok" />
                                    </div>
                                </div>

                                {/* Relasi Dropdowns */}
                                <div className="row g-3 mt-2">
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-secondary">Penulis <span className="text-danger">*</span></label>
                                        <select name="author_id" className={`form-select ${isInvalid('author_id')}`} value={formData.author_id} onChange={handleChange}>
                                            <option value="">-- Pilih Penulis --</option>
                                            {authors.map(a => <option key={a.id} value={a.id}>{a.nama}</option>)}
                                        </select>
                                        <FieldError fieldName="author_id" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-secondary">Kategori <span className="text-danger">*</span></label>
                                        <select name="kategori_id" className={`form-select ${isInvalid('kategori_id')}`} value={formData.kategori_id} onChange={handleChange}>
                                            <option value="">-- Pilih Kategori --</option>
                                            {genres.map(g => <option key={g.id} value={g.id}>{g.kategori}</option>)}
                                        </select>
                                        <FieldError fieldName="kategori_id" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-secondary">Segmentasi <span className="text-danger">*</span></label>
                                        <select name="segmentasi_id" className={`form-select ${isInvalid('segmentasi_id')}`} value={formData.segmentasi_id} onChange={handleChange}>
                                            <option value="">-- Pilih Segmentasi --</option>
                                            {segmentations.map(s => <option key={s.id} value={s.id}>{s.segmentasi}</option>)}
                                        </select>
                                        <FieldError fieldName="segmentasi_id" />
                                    </div>
                                </div>

                                {/* Detail Fisik Buku */}
                                <h6 className="mt-5 mb-3 fw-bold text-primary border-bottom pb-2">Detail Fisik & Spesifikasi</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-secondary">Penerbit <span className="text-danger">*</span></label>
                                        <input type="text" name="penerbit" className={`form-control ${isInvalid('penerbit')}`} value={formData.penerbit} onChange={handleChange} />
                                        <FieldError fieldName="penerbit" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold text-secondary">Tahun <span className="text-danger">*</span></label>
                                        <input type="number" name="tahun_terbit" className={`form-control ${isInvalid('tahun_terbit')}`} placeholder="YYYY" value={formData.tahun_terbit} onChange={handleChange} />
                                        <FieldError fieldName="tahun_terbit" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold text-secondary">Halaman</label>
                                        <input type="number" name="hal" className={`form-control ${isInvalid('hal')}`} value={formData.hal} onChange={handleChange} />
                                        <FieldError fieldName="hal" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold text-secondary">Ukuran</label>
                                        <input type="text" name="ukuran" className={`form-control ${isInvalid('ukuran')}`} placeholder="14x21 cm" value={formData.ukuran} onChange={handleChange} />
                                        <FieldError fieldName="ukuran" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold text-secondary">Kertas Cover</label>
                                        <input type="text" name="kertas_cover" className={`form-control ${isInvalid('kertas_cover')}`} value={formData.kertas_cover} onChange={handleChange} />
                                        <FieldError fieldName="kertas_cover" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold text-secondary">Kertas Isi</label>
                                        <input type="text" name="kertas_isi" className={`form-control ${isInvalid('kertas_isi')}`} value={formData.kertas_isi} onChange={handleChange} />
                                        <FieldError fieldName="kertas_isi" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold text-secondary">Catatan (Stok)</label>
                                        <input type="text" name="catatan" className={`form-control ${isInvalid('catatan')}`} placeholder="Stok tersedia" value={formData.catatan} onChange={handleChange} />
                                        <FieldError fieldName="catatan" />
                                    </div>
                                </div>
                                
                                <div className="row g-3 mt-2">
                                     <div className="col-md-6">
                                        <label className="form-label fw-semibold text-secondary">Warna Cover</label>
                                        <input type="text" name="warna_cover" className={`form-control ${isInvalid('warna_cover')}`} value={formData.warna_cover} onChange={handleChange} />
                                        <FieldError fieldName="warna_cover" />
                                    </div>
                                     <div className="col-md-6">
                                        <label className="form-label fw-semibold text-secondary">Warna Isi</label>
                                        <input type="text" name="warna_isi" className={`form-control ${isInvalid('warna_isi')}`} value={formData.warna_isi} onChange={handleChange} />
                                        <FieldError fieldName="warna_isi" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: Upload & Legalitas */}
                    <div className="col-lg-4">
                        {/* Card Upload Cover */}
                        <div className="card shadow-lg border-0 rounded-4 mb-4">
                            <div className="card-header bg-white border-bottom py-3 px-4">
                                <h5 className="m-0 fw-bold text-primary">Cover Buku</h5>
                            </div>
                            <div className="card-body text-center p-4">
                                <div className="mb-3 position-relative d-inline-block">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="img-fluid rounded-3 shadow-sm border" style={{ maxHeight: '250px', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="bg-light rounded-3 d-flex flex-column align-items-center justify-content-center border border-dashed" style={{ width: '100%', height: '250px', minWidth: '200px' }}>
                                            <Upload className="text-secondary mb-2" size={40} />
                                            <span className="text-muted small">Upload Cover</span>
                                        </div>
                                    )}
                                </div>
                                
                                <input type="file" id="coverUpload" className="d-none" onChange={handleFileChange} accept="image/*" />
                                <label htmlFor="coverUpload" className="btn btn-outline-primary w-100 fw-semibold">
                                    <Upload size={18} className="me-2" /> Pilih Gambar
                                </label>
                                <FieldError fieldName="cover_buku" />
                                <small className="text-muted d-block mt-2">Format: JPG, PNG. Maks: 2MB</small>
                            </div>
                        </div>

                        {/* Card Legalitas */}
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-header bg-white border-bottom py-3 px-4">
                                <h5 className="m-0 fw-bold text-primary">Legalitas</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-secondary small">No. Surat Puskurbuk</label>
                                    <input type="text" name="no_surat_puskurbuk" className={`form-control ${isInvalid('no_surat_puskurbuk')}`} value={formData.no_surat_puskurbuk} onChange={handleChange} />
                                    <FieldError fieldName="no_surat_puskurbuk" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-secondary small">Tgl. Surat Keputusan</label>
                                    <input type="date" name="tgl_surat_keputusan" className={`form-control ${isInvalid('tgl_surat_keputusan')}`} value={formData.tgl_surat_keputusan} onChange={handleChange} />
                                    <FieldError fieldName="tgl_surat_keputusan" />
                                </div>
                            </div>
                        </div>

                        {/* Tombol Simpan */}
                        <div className="mt-4 d-grid gap-2">
                            <button type="submit" className="btn btn-primary btn-lg fw-bold shadow-sm" disabled={loading}>
                                {loading ? 'Menyimpan...' : (
                                    <>
                                        <Save size={20} className="me-2" /> Simpan Buku
                                    </>
                                )}
                            </button>
                            <button type="button" className="btn btn-light text-secondary fw-semibold" onClick={() => navigate('/admin/books')}>
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BookForm;