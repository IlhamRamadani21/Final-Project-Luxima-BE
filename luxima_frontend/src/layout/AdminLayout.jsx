import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Tags, Layers, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Helper untuk menentukan menu aktif
    const isActive = (path) => location.pathname.startsWith(path);

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/books', label: 'Manajemen Buku', icon: <BookOpen size={20} /> },
        // Menu placeholder untuk pengembangan selanjutnya
        { path: '/admin/authors', label: 'Penulis', icon: <Users size={20} /> },
        { path: '/admin/genres', label: 'Kategori', icon: <Tags size={20} /> },
        { path: '/admin/segmentations', label: 'Segmentasi', icon: <Layers size={20} /> },
    ];

    return (
        <div className="d-flex min-vh-100 bg-light font-sans">
            {/* SIDEBAR */}
            <aside 
                className="d-flex flex-column flex-shrink-0 p-3 text-white shadow-lg position-fixed h-100" 
                style={{ width: '260px', backgroundColor: '#1e293b', zIndex: 1000 }}
            >
                {/* Logo Area */}
                <div className="d-flex align-items-center mb-4 mb-md-0 me-md-auto text-white text-decoration-none px-3 pt-2">
                    <span className="fs-4 fw-bold text-uppercase tracking-wider">Luxima <span className="text-primary">Admin</span></span>
                </div>
                
                <hr className="text-secondary opacity-25 my-4" />

                {/* Menu Items */}
                <ul className="nav nav-pills flex-column mb-auto gap-2">
                    {menuItems.map((item) => (
                        <li key={item.path} className="nav-item">
                            <Link 
                                to={item.path} 
                                className={`nav-link d-flex align-items-center gap-3 px-3 py-3 fw-medium transition-all ${
                                    isActive(item.path) 
                                    ? 'bg-primary text-white shadow-sm' 
                                    : 'text-secondary hover-text-white'
                                }`}
                                style={{
                                    borderRadius: '12px',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: isActive(item.path) ? '#3b82f6' : 'transparent',
                                    color: isActive(item.path) ? '#fff' : '#94a3b8'
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <hr className="text-secondary opacity-25" />

                {/* User Profile & Logout */}
                <div className="dropdown pb-3">
                    <div className="d-flex align-items-center px-3 mb-3 text-white">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '35px', height: '35px'}}>
                            A
                        </div>
                        <div className="small">
                            <div className="fw-bold">{user.name}</div>
                            <div className="text-secondary" style={{fontSize: '0.75rem'}}>{user.email}</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                        style={{borderRadius: '10px'}}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-grow-1" style={{ marginLeft: '260px' }}>
                <main className="p-4 p-md-5">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;