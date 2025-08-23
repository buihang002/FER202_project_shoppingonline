import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:9999";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [alerts, setAlerts] = useState([]); // state quản lý alert

  useEffect(() => {
    // Lấy sellers
    fetch(`${API_URL}/users?role=seller`)
      .then((res) => res.json())
      .then((currentSellers) => {
        setSellers(currentSellers);

        // Lấy products
        fetch(`${API_URL}/products`)
          .then((res) => res.json())
          .then((allProducts) => {
            const sellerIds = currentSellers.map((s) => s.id);
            let updatedProducts = [...allProducts];

            // Tìm sản phẩm có seller bị xóa
            const orphanProducts = allProducts.filter(
              (p) => p.sellerId && !sellerIds.includes(p.sellerId)
            );

            if (orphanProducts.length > 0) {
              const newAlerts = orphanProducts.map((p) => ({
                id: p.id,
                message: `Sản phẩm "${p.title}" thuộc seller ID ${p.sellerId} đã bị xóa khỏi hệ thống.`,
              }));
              setAlerts(newAlerts);
            }

            // Lọc ra các sản phẩm còn valid
            updatedProducts = allProducts.filter(
              (p) => !p.sellerId || sellerIds.includes(p.sellerId)
            );

            setProducts(updatedProducts);
          });
      });

    // Lấy categories
    fetch(`${API_URL}/categories`).then((res) => res.json()).then(setCategories);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      fetch(`${API_URL}/products/${id}`, { method: "DELETE" }).catch((err) =>
        console.error(err)
      );
    }
  };

  const handleHide = (id) => {
    if (window.confirm("Are you sure you want to hide this product?")) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, hidden: true } : p))
      );
      // TODO: call PATCH API
    }
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory ? p.categoryId === filterCategory : true;
    return matchSearch && matchCategory;
  });

  const getCategoryName = (id) => {
    const c = categories.find((cat) => cat.id === id);
    return c ? c.name : "-";
  };

  const getSellerName = (id) => {
    const s = sellers.find((u) => u.id === id);
    return s ? s.fullname : "Unknown";
  };

  return (
    <div className="container py-4 position-relative">
      <h1 className="mb-4">Product Management (Admin)</h1>

      {/* Alerts absolute */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            {alert.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => removeAlert(alert.id)}
            ></button>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="d-flex gap-3 mb-3">
        <input
          type="text"
          placeholder="Search products..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Seller</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <tr key={p.id} className={p.hidden ? "table-secondary" : ""}>
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
                <td>{p.hidden ? "Hidden" : "Active"}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2">Edit</button>
                  {!p.hidden && (
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleHide(p.id)}
                    >
                      Hide
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductPage;
