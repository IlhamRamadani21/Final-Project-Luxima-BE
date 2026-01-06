import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange 
}) => {
    if (totalItems === 0) return null;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const goToFirstPage = () => onPageChange(1);
    const goToLastPage = () => onPageChange(totalPages);
    const goToPrevPage = () => onPageChange(Math.max(currentPage - 1, 1));
    const goToNextPage = () => onPageChange(Math.min(currentPage + 1, totalPages));

    return (
        <div className="card-footer bg-white py-3 px-3 px-md-4 border-top">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                
                {/* Info Data - Menggunakan order-2 di mobile agar teks info ada di bawah tombol */}
                <div className="text-muted small order-2 order-md-1">
                    Menampilkan <span className="fw-bold text-dark">{indexOfFirstItem + 1}</span> - <span className="fw-bold text-dark">{Math.min(indexOfLastItem, totalItems)}</span> dari <span className="fw-bold text-dark">{totalItems}</span> data
                </div>

                {/* Controls - Menggunakan order-1 di mobile agar navigasi lebih mudah dijangkau jari */}
                <nav aria-label="Page navigation" className="order-1 order-md-2">
                    <ul className="pagination pagination-sm m-0 shadow-sm flex-wrap justify-content-center">
                        
                        {/* First */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link border-0 rounded-start px-2 py-2" onClick={goToFirstPage}>
                                <ChevronsLeft size={16} />
                            </button>
                        </li>

                        {/* Prev */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link border-0 px-2 py-2" onClick={goToPrevPage}>
                                <ChevronLeft size={16} />
                            </button>
                        </li>

                        {/* Smart Numbers - Sembunyikan angka di layar sangat kecil jika terlalu banyak */}
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            if (
                                page === 1 || 
                                page === totalPages || 
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <li key={i} className={`page-item d-none d-sm-block ${currentPage === page ? 'active' : ''}`}>
                                        <button className="page-link border-0 px-3 py-2 mx-1 rounded" onClick={() => onPageChange(page)}>
                                            {page}
                                        </button>
                                    </li>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return <li key={i} className="page-item disabled d-none d-sm-block"><span className="page-link border-0 px-2">...</span></li>;
                            }
                            return null;
                        })}
                        
                        {/* Indikator Halaman Mobile (Hanya muncul di HP) */}
                        <li className="page-item disabled d-sm-none">
                            <span className="page-link border-0 fw-bold text-dark px-3">
                                {currentPage} / {totalPages}
                            </span>
                        </li>

                        {/* Next */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link border-0 px-2 py-2" onClick={goToNextPage}>
                                <ChevronRight size={16} />
                            </button>
                        </li>

                        {/* Last */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link border-0 rounded-end px-2 py-2" onClick={goToLastPage}>
                                <ChevronsRight size={16} />
                            </button>
                        </li>

                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Pagination;