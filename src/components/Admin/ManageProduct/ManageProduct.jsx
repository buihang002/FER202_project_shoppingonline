// // import React, { useEffect, useState } from "react";

// // const API_URL = "http://localhost:9999";

// // const AdminProductPage = () => {
// //   const [products, setProducts] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [sellers, setSellers] = useState([]);
// //   const [search, setSearch] = useState("");
// //   const [filterCategory, setFilterCategory] = useState("");
// //   const [alerts, setAlerts] = useState([]);

// //   // Load data
// //   useEffect(() => {
// //     fetch(`${API_URL}/users?role=seller`)
// //       .then((res) => res.json())
// //       .then((currentSellers) => {
// //         setSellers(currentSellers);

// //         fetch(`${API_URL}/products`)
// //           .then((res) => res.json())
// //           .then((allProducts) => {
// //             const sellerIds = currentSellers.map((s) => s.id);

// //             // Phát hiện sản phẩm không có seller
// //             const orphanProducts = allProducts.filter(
// //               (p) => p.sellerId && !sellerIds.includes(p.sellerId)
// //             );

// //             if (orphanProducts.length > 0) {
// //               const newAlerts = orphanProducts.map((p) => ({
// //                 id: p.sellerId,
// //                 message: `Sản phẩm "${p.title}" của seller ID ${p.sellerId} đã bị xóa khỏi hệ thống!`,
// //               }));
// //               setAlerts(newAlerts);
// //             }

// //             // Giữ lại sản phẩm hợp lệ
// //             const validProducts = allProducts.filter(
// //               (p) => !p.sellerId || sellerIds.includes(p.sellerId)
// //             );
// //             setProducts(validProducts);
// //           });
// //       });

// //     fetch(`${API_URL}/categories`).then((res) => res.json()).then(setCategories);
// //   }, []);

// //   // Xóa từng sản phẩm
// //   const handleDelete = (productId) => {
// //     if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
// //       fetch(`${API_URL}/products/${productId}`, { method: "DELETE" })
// //         .then(() => {
// //           setProducts((prev) => prev.filter((p) => p.id !== productId));
// //         })
// //         .catch(console.error);
// //     }
// //   };

// //   // Ẩn sản phẩm
// //   const handleHide = (id) => {
// //     setProducts((prev) =>
// //       prev.map((p) => (p.id === id ? { ...p, hidden: true } : p))
// //     );
// //   };

// //   // Xóa tất cả sản phẩm của seller
// //   const handleDeleteSellerProducts = (sellerId) => {
// //     const confirmDelete = window.confirm(
// //       `Bạn có chắc muốn xóa toàn bộ sản phẩm của seller ID ${sellerId}?`
// //     );
// //     if (!confirmDelete) return;

// //     const sellerProducts = products.filter((p) => p.sellerId === sellerId);
// //     Promise.all(
// //       sellerProducts.map((p) =>
// //         fetch(`${API_URL}/products/${p.id}`, { method: "DELETE" })
// //       )
// //     )
// //       .then(() => {
// //         setProducts((prev) => prev.filter((p) => p.sellerId !== sellerId));
// //         setAlerts((prev) => prev.filter((a) => a.id !== sellerId));
// //       })
// //       .catch(console.error);
// //   };

// //   // Đóng alert
// //   const removeAlert = (id) => {
// //     setAlerts((prev) => prev.filter((a) => a.id !== id));
// //   };

// //   // Filter products
// //   const filteredProducts = products.filter((p) => {
// //     const matchSearch =
// //       p.title.toLowerCase().includes(search.toLowerCase()) ||
// //       p.description?.toLowerCase().includes(search.toLowerCase());
// //     const matchCategory = filterCategory ? p.categoryId === filterCategory : true;
// //     return matchSearch && matchCategory;
// //   });

// //   const getCategoryName = (id) => {
// //     const c = categories.find((cat) => cat.id === id);
// //     return c ? c.name : "-";
// //   };

// //   const getSellerName = (id) => {
// //     const s = sellers.find((u) => u.id === id);
// //     return s ? s.fullname : "Unknown";
// //   };

// //   return (
// //     <div className="container py-4 position-relative">
// //       <h1 className="mb-4">Quản lý Sản phẩm (Admin)</h1>

// //       {/* Alerts absolute */}
// //       <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
// //         {alerts.map((alert) => (
// //           <div
// //             key={alert.id}
// //             className="alert alert-warning alert-dismissible fade show"
// //             role="alert"
// //           >
// //             {alert.message}{" "}
// //             <button
// //               className="btn btn-sm btn-danger"
// //               onClick={() => handleDeleteSellerProducts(alert.id)}
// //             >
// //               Xóa tất cả sản phẩm của seller
// //             </button>
// //             <button
// //               type="button"
// //               className="btn-close"
// //               onClick={() => removeAlert(alert.id)}
// //             ></button>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Search + Filter */}
// //       <div className="d-flex gap-3 mb-3">
// //         <input
// //           type="text"
// //           placeholder="Tìm kiếm sản phẩm..."
// //           className="form-control"
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //         />
// //         <select
// //           className="form-select"
// //           value={filterCategory}
// //           onChange={(e) => setFilterCategory(e.target.value)}
// //         >
// //           <option value="">Tất cả danh mục</option>
// //           {categories.map((c) => (
// //             <option key={c.id} value={c.id}>
// //               {c.name}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* Product Table */}
// //       <table className="table table-striped table-bordered">
// //         <thead className="table-dark">
// //           <tr>
// //             <th>ID</th>
// //             <th>Hình ảnh</th>
// //             <th>Title</th>
// //             <th>Category</th>
// //             <th>Seller</th>
// //             <th>Price</th>
// //             <th>Status</th>
// //             <th>Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {filteredProducts.length > 0 ? (
// //             filteredProducts.map((p) => (
// //               <tr key={p.id} className={p.hidden ? "table-secondary" : ""}>
// //                 <td>{p.id}</td>
// //                 <td>
// //                   <img
// //                     src={p.image}
// //                     alt={p.title}
// //                     style={{ width: "70px", height: "50px", objectFit: "cover" }}
// //                   />
// //                 </td>
// //                 <td>{p.title}</td>
// //                 <td>{getCategoryName(p.categoryId)}</td>
// //                 <td>{getSellerName(p.sellerId)}</td>
// //                 <td>${p.price}</td>
// //                 <td>{p.hidden ? "Hidden" : "Active"}</td>
// //                 <td>
// //                   <button className="btn btn-sm btn-primary me-2">Edit</button>
// //                   {!p.hidden && (
// //                     <button
// //                       className="btn btn-sm btn-warning me-2"
// //                       onClick={() => handleHide(p.id)}
// //                     >
// //                       Hide
// //                     </button>
// //                   )}
// //                   <button
// //                     className="btn btn-sm btn-danger"
// //                     onClick={() => handleDelete(p.id)}
// //                   >
// //                     Delete
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))
// //           ) : (
// //             <tr>
// //               <td colSpan="8" className="text-center">
// //                 Không có sản phẩm
// //               </td>
// //             </tr>
// //           )}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default AdminProductPage;
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const API_URL = "http://localhost:9999";

// const AdminProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [sellers, setSellers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filterCategory, setFilterCategory] = useState("");

//   useEffect(() => {
//     fetch(`${API_URL}/users?role=seller`)
//       .then(res => res.json())
//       .then(setSellers);

//     fetch(`${API_URL}/products`)
//       .then(res => res.json())
//       .then(setProducts);

//     fetch(`${API_URL}/categories`)
//       .then(res => res.json())
//       .then(setCategories);
//   }, []);

//   const filteredProducts = products.filter(p => {
//     const matchSearch =
//       p.title.toLowerCase().includes(search.toLowerCase()) ||
//       p.description?.toLowerCase().includes(search.toLowerCase());
//     const matchCategory = filterCategory ? p.categoryId === filterCategory : true;
//     return matchSearch && matchCategory;
//   });

//   const getCategoryName = (id) => categories.find(c => c.id === id)?.name || "-";
//   const getSellerName = (id) => sellers.find(u => u.id === id)?.fullname || "Unknown";

//   return (
//     <div className="container py-4">
//       <h1 className="mb-4">Quản lý Sản phẩm</h1>

//       <div className="d-flex gap-3 mb-3">
//         <input
//           type="text"
//           placeholder="Tìm kiếm sản phẩm..."
//           className="form-control"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//         />
//         <select
//           className="form-select"
//           value={filterCategory}
//           onChange={e => setFilterCategory(e.target.value)}
//         >
//           <option value="">Tất cả danh mục</option>
//           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//         </select>
//       </div>

//       <table className="table table-striped table-bordered">
//         <thead className="table-dark">
//           <tr>
//             <th>ID</th>
//             <th>Title</th>
//             <th>Category</th>
//             <th>Seller</th>
//             <th>Price</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredProducts.length > 0 ? filteredProducts.map(p => (
//             <tr key={p.id}>
//               <td>{p.id}</td>
//               <td>{p.title}</td>
//               <td>{getCategoryName(p.categoryId)}</td>
//               <td>{getSellerName(p.sellerId)}</td>
//               <td>${p.price}</td>
//               <td>
//                 <Link className="btn btn-sm btn-info" to={`/product/${p.id}`}>
//                   Details
//                 </Link>
//               </td>
//             </tr>
//           )) : (
//             <tr>
//               <td colSpan="6" className="text-center">Không có sản phẩm</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminProductsPage;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:9999";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    // Load sellers
    fetch(`${API_URL}/users?role=seller`)
      .then(res => res.json())
      .then(setSellers);

    // Load categories
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(setCategories);

    // Load products
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || "-";
  const getSellerName = (id) => sellers.find(s => s.id === id)?.fullname || "Unknown";

  const filteredProducts = products.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory ? p.categoryId === filterCategory : true;
    return matchSearch && matchCategory;
  });

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      fetch(`${API_URL}/products/${id}`, { method: "DELETE" })
        .then(() => setProducts(prev => prev.filter(p => p.id !== id)))
        .catch(console.error);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Quản lý Sản phẩm</h1>

      {/* Search + Filter */}
      <div className="d-flex gap-3 mb-3">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="form-control"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Title</th>
            <th>Category</th>
            <th>Seller</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{ width: "70px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td>{p.title}</td>
                <td>{getCategoryName(p.categoryId)}</td>
                <td>{getSellerName(p.sellerId)}</td>
                <td>${p.price}</td>
                <td>
                  <Link to={`/admin/product/${p.id}`} className="btn btn-sm btn-info me-2">
                    Details
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">Không có sản phẩm</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProduct;
