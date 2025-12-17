import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuestRoute from './components/GuestRoute';
import AdminRoute from './components/AdminRoute';

// Import semua halaman yang sudah dibuat
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import About from './pages/About';
import Category from './pages/Category';
import Cart from './pages/Cart';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BookList from './pages/admin/BookList';
import BookForm from './pages/admin/BookForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />      
        <Route path="/kategori" element={<Category />} /> 
        <Route path="/keranjang" element={<Cart />} />

        <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
                {/* Redirect /admin ke dashboard */}
                <Route index element={<Dashboard />} /> 
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Manage Books */}
                <Route path="books" element={<BookList />} />
                <Route path="books/create" element={<BookForm />} />
                <Route path="books/edit/:id" element={<BookForm />} />
            </Route>
        </Route> 

        {/* Jika sudah login, tidak bisa akses route di dalam sini */}
        <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;