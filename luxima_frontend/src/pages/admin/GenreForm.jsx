import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Book, Tags } from 'lucide-react';
import api from '../../api';

const GenreForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        kategori: '',
        deskripsi: ''
    });
    const [booksList, setBooksList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch Data saat Edit
    useEffect(() => {
        if (isEdit) {
            const fetchGenre = async () => {
                try {
                    const { data } = await api.get(`/genres/${id}`);
                    setFormData({
                        kategori: data.data.kategori,
                        deskripsi: data.data.deskripsi || ''
                    });
                    setBooksList(data.data.books || []);
                } catch (err) {
                    console.log(err);
                    setError('Gagal mengambil data kategori.');
                }
            };
            fetchGenre();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            if (isEdit) {
                await api.put(`/genres/${id}`, formData);
            } else {
                await api.post('/genres', formData);
            }
            navigate('/admin/genres');
        } catch (err) {
            if (err.response?.status === 422) {
                setValidationErrors(err.response.data.errors || {});
                setError("Validasi gagal. Periksa kembali input Anda.");
            } else {
                setError(err.response?.data?.message || 'Terjadi kesalahan sistem.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid px-4 py-4 bg-light min-vh-100 font-sans">
            <div className="d-flex align-items-center gap-3 mb-4">
                <Link to="/admin/genres" className="btn btn-outline-secondary rounded-circle p-2">
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="h3 fw-bold text-dark m-0">{isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
            </div>

            {error && (
                <div className="alert alert-danger d-flex align-items-center shadow-sm rounded-3 mb-4">
                    <AlertCircle className="me-2" size={20} />
                    <div>{error}</div>
                </div>
            )}

            <div className="row g-4">
                {/* KOLOM KIRI: FORM */}
                <div className="col-lg-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-header bg-white py-3 px-4 border-bottom">
                            <h5 className="m-0 fw-bold text-primary">Informasi Kategori</h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-secondary">Nama Kategori <span className="text-danger">*</span></label>
                                    <input 
                                        type="text" 
                                        name="kategori"
                                        className={`form-control form-control-lg ${validationErrors.kategori ? 'is-invalid' : ''}`}
                                        value={formData.kategori}
                                        onChange={handleChange}
                                        placeholder="Contoh: Fiksi, Sejarah"
                                    />
                                    {validationErrors.kategori && <div className="text-danger small mt-1">{validationErrors.kategori[0]}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-secondary">Deskripsi</label>
                                    <textarea 
                                        name="deskripsi"
                                        className="form-control"
                                        rows="4"
                                        value={formData.deskripsi}
                                        onChange={handleChange}
                                        placeholder="Deskripsi singkat tentang kategori ini..."
                                    ></textarea>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg fw-bold shadow-sm" disabled={loading}>
                                        <Save size={18} className="me-2" /> {loading ? 'Menyimpan...' : 'Simpan Kategori'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: LIST BUKU (Hanya saat Edit) */}
                {isEdit && (
                    <div className="col-lg-7">
                        <div className="card shadow-lg border-0 rounded-4 h-100">
                            <div className="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
                                <h5 className="m-0 fw-bold text-dark d-flex align-items-center">
                                    <Book className="me-2 text-primary" size={20} /> 
                                    Buku dalam Kategori Ini ({booksList.length})
                                </h5>
                                <Link to="/admin/books/create" className="btn btn-sm btn-outline-primary fw-bold">
                                    + Tambah Buku
                                </Link>
                            </div>
                            <div className="card-body p-0">
                                {booksList.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        <Tags size={40} className="mb-3 opacity-25" />
                                        <p className="mb-0">Belum ada buku di kategori ini.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="px-4 py-2 small fw-bold text-secondary">Cover</th>
                                                    <th className="px-4 py-2 small fw-bold text-secondary">Judul Buku</th>
                                                    <th className="px-4 py-2 small fw-bold text-secondary text-end">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {booksList.map((book) => (
                                                    <tr key={book.id}>
                                                        <td className="px-4 py-2">
                                                            {book.cover_buku ? (
                                                                <img src={`http://127.0.0.1:8000/storage/${book.cover_buku}`} alt="cover" className="rounded" style={{width:'30px', height:'45px', objectFit:'cover'}} />
                                                            ) : <span className="small text-muted">-</span>}
                                                        </td>
                                                        <td className="px-4 py-2 fw-semibold text-dark">{book.judul}</td>
                                                        <td className="px-4 py-2 text-end">
                                                            <Link to={`/admin/books/edit/${book.id}`} className="btn btn-link btn-sm text-decoration-none small">Lihat</Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenreForm;