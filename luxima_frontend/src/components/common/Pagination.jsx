import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange 
}) => {
    // Jika tidak ada data, jangan tampilkan pagination
    if (totalItems === 0) return null;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Fungsi Navigasi
    const goToFirstPage = () => onPageChange(1);
    const goToLastPage = () => onPageChange(totalPages);
    const goToPrevPage = () => onPageChange(Math.max(currentPage - 1, 1));
    const goToNextPage = () => onPageChange(Math.min(currentPage + 1, totalPages));

    return (
        <div className="card-footer bg-white py-3 px-4 border-top">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                
                {/* Info Data */}
                <span className="text-muted small text-center text-md-start">
                    Menampilkan <span className="fw-bold text-dark">{indexOfFirstItem + 1}</span> - <span className="fw-bold text-dark">{Math.min(indexOfLastItem, totalItems)}</span> dari <span className="fw-bold text-dark">{totalItems}</span> data
                </span>

                {/* Controls */}
                <nav aria-label="Page navigation">
                    <ul className="pagination pagination-sm m-0 shadow-sm">
                        
                        {/* First */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link border-0 rounded-start px-2 py-2" onClick={goToFirstPage} title="Halaman Pertama">
                                <ChevronsLeft size={14} />
                            </button>
                        </li>

                        {/* Prev */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link border-0 px-2 py-2" onClick={goToPrevPage} title="Sebelumnya">
                                <ChevronLeft size={14} />
                            </button>
                        </li>

                        {/* Smart Numbers */}
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            if (
                                page === 1 || 
                                page === totalPages || 
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <li key={i} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button className="page-link border-0 px-3 py-2 mx-1 rounded" onClick={() => onPageChange(page)}>
                                            {page}
                                        </button>
                                    </li>
                                );
                            } else if (
                                page === currentPage - 2 || 
                                page === currentPage + 2
                            ) {
                                return <li key={i} className="page-item disabled"><span className="page-link border-0 px-2">...</span></li>;
                            }
                            return null;
                        })}

                        {/* Next */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link border-0 px-2 py-2" onClick={goToNextPage} title="Selanjutnya">
                                <ChevronRight size={14} />
                            </button>
                        </li>

                        {/* Last */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link border-0 rounded-end px-2 py-2" onClick={goToLastPage} title="Halaman Terakhir">
                                <ChevronsRight size={14} />
                            </button>
                        </li>

                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Pagination;