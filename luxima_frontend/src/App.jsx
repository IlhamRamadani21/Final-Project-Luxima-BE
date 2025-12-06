import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import semua halaman yang sudah dibuat
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import About from './pages/About';
import Category from './pages/Category';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />      
        <Route path="/kategori" element={<Category />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;