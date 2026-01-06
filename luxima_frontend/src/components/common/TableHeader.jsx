import React from 'react';
import { Search } from 'lucide-react';

const TableHeader = ({ 
    itemsPerPage, 
    onItemsPerPageChange, 
    searchTerm, 
    onSearchChange,
    placeholder = "Cari data..."
}) => {
    return (
        <div className="card-header bg-white py-3 px-3 px-md-4 border-bottom">
            <div className="row g-3 align-items-center">
                
                {/* KIRI: Rows Per Page Selector */}
                <div className="col-12 col-sm-auto d-flex align-items-center justify-content-center justify-content-sm-start">
                    <label className="text-muted small me-2 fw-semibold mb-0">Tampilkan</label>
                    <select 
                        className="form-select form-select-sm border-secondary border-opacity-25 shadow-sm" 
                        style={{ width: "75px", cursor: "pointer" }} 
                        value={itemsPerPage} 
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="text-muted small ms-2 fw-semibold">baris</span>
                </div>

                {/* KANAN: Search Bar - Menyesuaikan lebar secara otomatis */}
                <div className="col-12 col-sm-6 col-md-4 ms-auto">
                    <div className="input-group input-group-sm shadow-sm border rounded">
                        <span className="input-group-text bg-white border-0">
                            <Search size={16} className="text-muted" />
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 bg-white ps-1" 
                            placeholder={placeholder} 
                            value={searchTerm} 
                            onChange={(e) => onSearchChange(e.target.value)} 
                        />
                        {searchTerm && (
                            <button 
                                className="btn btn-white border-0 text-muted" 
                                type="button" 
                                onClick={() => onSearchChange("")}
                            >
                                &times;
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableHeader;