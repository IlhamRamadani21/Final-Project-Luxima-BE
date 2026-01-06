import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
   BookOpen,
   Users,
   Tags,
   TrendingUp,
   PlusCircle,
   ArrowRight,
   ShoppingBag,
   Clock,
   Search,
   Truck,
   CheckCircle,
   XCircle,
} from "lucide-react";
import api from "../../api";

const Dashboard = () => {
   const [stats, setStats] = useState({
      books: 0,
      authors: 0,
      genres: 0,
      segments: 0,
      transactions: 0,
   });
   const [recentOrders, setRecentOrders] = useState([]); // State untuk tabel aktivitas
   const [loading, setLoading] = useState(true);

   const userString = localStorage.getItem("user");
   const user = userString ? JSON.parse(userString) : null;

   // Helper Status Badge
   const getStatusBadge = (status) => {
      switch (status) {
         case "pending_payment":
            return (
               <span className="badge bg-warning text-dark">
                  <Clock size={10} className="me-1" /> Menunggu
               </span>
            );
         case "pending_verification":
            return (
               <span className="badge bg-info text-dark">
                  <Search size={10} className="me-1" /> Verifikasi
               </span>
            );
         case "processed":
            return <span className="badge bg-primary">Diproses</span>;
         case "shipped":
            return (
               <span className="badge bg-primary bg-opacity-75">
                  <Truck size={10} className="me-1" /> Dikirim
               </span>
            );
         case "completed":
            return (
               <span className="badge bg-success">
                  <CheckCircle size={10} className="me-1" /> Selesai
               </span>
            );
         case "cancelled":
            return (
               <span className="badge bg-danger">
                  <XCircle size={10} className="me-1" /> Batal
               </span>
            );
         default:
            return <span className="badge bg-secondary">{status}</span>;
      }
   };

   useEffect(() => {
      const fetchStats = async () => {
         try {
            // PERBAIKAN: Endpoint transaksi adalah /admin/orders
            const [resBooks, resAuthors, resGenres, resSegments, resOrders] =
               await Promise.all([
                  api.get("/books"),
                  api.get("/authors"),
                  api.get("/genres"),
                  api.get("/segmentations"),
                  api.get("/admin/orders"),
               ]);

            const ordersData = resOrders.data.data || [];

            setStats({
               books: resBooks.data.data?.length || 0,
               authors: resAuthors.data.data?.length || 0,
               genres: resGenres.data.data?.length || 0,
               segments: resSegments.data.data?.length || 0,
               transactions: ordersData.length,
            });

            setRecentOrders(ordersData.slice(0, 5));
         } catch (error) {
            console.error("Gagal memuat statistik dashboard", error);
         } finally {
            setLoading(false);
         }
      };

      fetchStats();
   }, []);

   // Component Kartu Statistik
   const StatCard = ({ title, count, icon, color, link }) => (
      <div className="col-md-6 col-lg-3">
         {" "}
         {/* col-xl-2 jika ingin 5 berjejer di layar lebar */}
         <div
            className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-scale"
            style={{ transition: "transform 0.2s" }}
         >
            <div className="card-body p-4 position-relative">
               <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                     <p className="text-secondary fw-semibold small text-uppercase mb-1">
                        {title}
                     </p>
                     <h3 className="fw-bold text-dark m-0">
                        {loading ? "..." : count}
                     </h3>
                  </div>
                  <div
                     className={`p-3 rounded-3 bg-opacity-10 text-white`}
                     style={{ backgroundColor: color }}
                  >
                     {React.cloneElement(icon, { size: 24, color: "white" })}
                  </div>
               </div>
               <Link
                  to={link}
                  className="text-decoration-none small fw-bold d-flex align-items-center"
                  style={{ color: color }}
               >
                  Lihat Detail <ArrowRight size={14} className="ms-1" />
               </Link>

               {/* Hiasan Background */}
               <div
                  className="position-absolute rounded-circle opacity-25"
                  style={{
                     width: "100px",
                     height: "100px",
                     backgroundColor: color,
                     top: "-20px",
                     right: "-20px",
                     filter: "blur(20px)",
                  }}
               ></div>
            </div>
         </div>
      </div>
   );

   return (
      <div className="container-fluid px-0 font-sans">
         {/* Header Welcome */}
         <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
            <div>
               <h2 className="fw-bold text-dark m-0">Dashboard Overview</h2>
               <p className="text-secondary m-0 mt-1">
                  Selamat datang kembali, {user?.name}! Berikut ringkasan toko
                  hari ini.
               </p>
            </div>
            <div className="d-flex gap-2">
               <Link
                  to="/admin/books/create"
                  className="btn btn-primary fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center"
               >
                  <PlusCircle size={18} className="me-2" /> Tambah Buku
               </Link>
            </div>
         </div>

         {/* Statistik Grid */}
         <div className="row g-4 mb-5 justify-content-center">
            <StatCard
               title="Total Buku"
               count={stats.books}
               icon={<BookOpen />}
               color="#3b82f6"
               link="/admin/books"
            />
            <StatCard
               title="Total Penulis"
               count={stats.authors}
               icon={<Users />}
               color="#10b981"
               link="/admin/authors"
            />
            <StatCard
               title="Kategori"
               count={stats.genres}
               icon={<Tags />}
               color="#f59e0b"
               link="/admin/genres"
            />
            <StatCard
               title="Segmentasi"
               count={stats.segments}
               icon={<TrendingUp />}
               color="#8b5cf6"
               link="/admin/segmentations"
            />
            <StatCard
               title="Total Transaksi"
               count={stats.transactions}
               icon={<ShoppingBag />}
               color="#f43f5e"
               link="/admin/transactions"
            />
         </div>

         {/* Quick Actions / Recent Section */}
         <div className="row g-4">
            {/* Tabel Aktivitas Terbaru */}
            <div className="col-lg-8">
               <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
                  <div className="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
                     <h5 className="m-0 fw-bold text-dark">
                        Transaksi Terbaru
                     </h5>
                     <Link
                        to="/admin/transactions"
                        className="btn btn-sm btn-light text-primary fw-bold"
                     >
                        Lihat Semua
                     </Link>
                  </div>
                  <div className="card-body p-0">
                     {loading ? (
                        <div className="text-center py-5">Loading...</div>
                     ) : recentOrders.length === 0 ? (
                        <div className="text-center py-5">
                           <img
                              src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
                              alt="Empty"
                              style={{ width: "80px", opacity: 0.5 }}
                              className="mb-3"
                           />
                           <h6 className="text-muted fw-semibold">
                              Belum ada aktivitas transaksi terbaru.
                           </h6>
                           <p className="small text-secondary">
                              Data transaksi akan muncul di sini.
                           </p>
                        </div>
                     ) : (
                        <div className="table-responsive">
                           <table className="table table-hover align-middle mb-0">
                              <thead className="bg-light">
                                 <tr>
                                    <th className="px-4 py-3 text-secondary small text-uppercase">
                                       ID
                                    </th>
                                    <th className="px-4 py-3 text-secondary small text-uppercase">
                                       Pemesan
                                    </th>
                                    <th className="px-4 py-3 text-secondary small text-uppercase">
                                       Total
                                    </th>
                                    <th className="px-4 py-3 text-secondary small text-uppercase">
                                       Status
                                    </th>
                                    <th className="px-4 py-3 text-end text-secondary small text-uppercase text-center">
                                       Aksi
                                    </th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                       <td className="px-4 py-3 fw-bold text-primary small">
                                          {order.code}
                                       </td>
                                       <td className="px-4 py-3 small">
                                          <div className="fw-semibold">
                                             {order.user?.name}
                                          </div>
                                          <div
                                             className="text-muted"
                                             style={{ fontSize: "0.75rem" }}
                                          >
                                             {new Date(
                                                order.created_at
                                             ).toLocaleDateString("id-ID")}
                                          </div>
                                       </td>
                                       <td className="px-4 py-3 fw-bold text-dark small">
                                          Rp{" "}
                                          {Number(
                                             order.total_price
                                          ).toLocaleString("id-ID")}
                                       </td>
                                       <td className="px-4 py-3">
                                          {getStatusBadge(order.status)}
                                       </td>
                                       <td className="px-4 py-3 text-end text-center">
                                          <Link
                                             to={`/admin/transactions/${order.id}`}
                                             className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                             style={{ fontSize: "0.75rem" }}
                                          >
                                             Detail
                                          </Link>
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

            {/* Kartu Bantuan */}
            <div className="col-lg-4">
               <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-primary text-white h-100">
                  <div className="card-body p-4 text-center d-flex flex-column justify-content-center">
                     <div
                        className="bg-white bg-opacity-25 rounded-circle p-3 mx-auto mb-3"
                        style={{ width: "fit-content" }}
                     >
                        <ShoppingBag size={32} className="text-white" />
                     </div>
                     <h4 className="fw-bold mb-2">Butuh Bantuan?</h4>
                     <p className="opacity-75 mb-4 small px-3">
                        Jika mengalami kendala teknis pada dashboard admin atau
                        data tidak sinkron, segera hubungi tim IT.
                     </p>
                     <button className="btn btn-light text-primary fw-bold w-100 rounded-3 py-2">
                        Hubungi IT Support
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
