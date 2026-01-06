import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Route Guards
import GuestRoute from "./components/GuestRoute";
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";

// Import Pages Public
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import About from "./pages/About";
import Category from "./pages/Category";
import DetailBook from "./pages/DetailBook";

// Import Pages User (Butuh Login)
import Cart from "./pages/Cart";
import MyOrders from "./pages/user/MyOrders";
import OrderDetail from "./pages/user/OrderDetail";

// Import Pages Admin
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import BookList from "./pages/admin/BookList";
import BookForm from "./pages/admin/BookForm";
import AuthorList from "./pages/admin/AuthorList";
import AuthorForm from "./pages/admin/AuthorForm";
import GenreList from "./pages/admin/GenreList";
import GenreForm from "./pages/admin/GenreForm";
import SegmentationList from "./pages/admin/SegmentationList";
import SegmentationForm from "./pages/admin/SegmentationForm";
import TransactionList from "./pages/admin/TransactionList";
import TransactionDetail from "./pages/admin/TransactionDetail";

function App() {
   return (
      <BrowserRouter>
         <Routes>
            {/* --- PUBLIC ROUTES (Siapa saja boleh akses) --- */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/kategori" element={<Category />} />
            <Route path="/kategori/detail/:id" element={<DetailBook />} />

            {/* --- USER ROUTES (Wajib Login) --- */}
            <Route element={<PrivateRoute />}>
               {/* Cart butuh login karena backend pakai Auth::id() */}
               <Route path="/keranjang" element={<Cart />} /> 
               
               {/* Order & History */}
               <Route path="/orders" element={<MyOrders />} />
               <Route path="/orders/:id" element={<OrderDetail />} />
            </Route>

            {/* --- ADMIN ROUTES (Wajib Login + Role Admin) --- */}
            <Route element={<AdminRoute />}>
               <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* Manage Books */}
                  <Route path="books" element={<BookList />} />
                  <Route path="books/create" element={<BookForm />} />
                  <Route path="books/edit/:id" element={<BookForm />} />

                  {/* Manage Authors */}
                  <Route path="authors" element={<AuthorList />} />
                  <Route path="authors/create" element={<AuthorForm />} />
                  <Route path="authors/edit/:id" element={<AuthorForm />} />

                  {/* Manage Genres */}
                  <Route path="genres" element={<GenreList />} />
                  <Route path="genres/create" element={<GenreForm />} />
                  <Route path="genres/edit/:id" element={<GenreForm />} />

                  {/* Manage Segmentations */}
                  <Route path="segmentations" element={<SegmentationList />} />
                  <Route path="segmentations/create" element={<SegmentationForm />} />
                  <Route path="segmentations/edit/:id" element={<SegmentationForm />} />

                  {/* Manage Transactions */}
                  <Route path="transactions" element={<TransactionList />} />
                  <Route path="transactions/:id" element={<TransactionDetail />} />
               </Route>
            </Route>

            {/* --- GUEST ROUTES (Hanya jika BELUM login) --- */}
            <Route element={<GuestRoute />}>
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
            </Route>

         </Routes>
      </BrowserRouter>
   );
}

export default App;