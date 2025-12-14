import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuestRoute from './components/GuestRoute';

// Import semua halaman yang sudah dibuat
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import About from './pages/About';
import Category from './pages/Category';
import Cart from './pages/Cart';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />      
        <Route path="/kategori" element={<Category />} /> 
        <Route path="/keranjang" element={<Cart />} /> 

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