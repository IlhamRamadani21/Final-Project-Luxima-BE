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
        <div className="card-header bg-white py-3 px-4 border-bottom">
            <div className="row g-3 align-items-center justify-content-between">
                
                {/* KIRI: Rows Per Page Selector */}
                <div className="col-auto d-flex align-items-center">
                    <span className="text-muted small me-2 fw-semibold">Tampilkan</span>
                    <select 
                        className="form-select form-select-sm border-secondary border-opacity-25" 
                        style={{ width: "70px", cursor: "pointer" }} 
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

                {/* KANAN: Search Bar */}
                <div className="col-12 col-md-4">
                    <div className="input-group input-group-sm shadow-sm">
                        <span className="input-group-text bg-white border-end-0">
                            <Search size={16} className="text-muted" />
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 bg-white" 
                            placeholder={placeholder} 
                            value={searchTerm} 
                            onChange={(e) => onSearchChange(e.target.value)} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableHeader;