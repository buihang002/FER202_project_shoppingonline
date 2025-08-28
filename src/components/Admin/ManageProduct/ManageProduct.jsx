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
      .then((res) => res.json())
      .then(setSellers);

    // Load categories
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then(setCategories);

    // Load products
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const getCategoryName = (id) =>
    categories.find((c) => c.id === id)?.name || "-";
  const getSellerName = (id) =>
    sellers.find((s) => s.id === id)?.fullname || "Unknown";

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory
      ? p.categoryId === filterCategory
      : true;
    return matchSearch && matchCategory;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`${API_URL}/products/${id}`, { method: "DELETE" })
        .then(() => setProducts((prev) => prev.filter((p) => p.id !== id)))
        .catch(console.error);
    }
  };

  // ====== Statistics ======
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalSellers = sellers.length;
  const avgPrice = totalProducts
    ? (
        products.reduce((sum, p) => sum + Number(p.price || 0), 0) /
        totalProducts
      ).toFixed(2)
    : 0;
  const maxPrice = totalProducts
    ? Math.max(...products.map((p) => Number(p.price || 0)))
    : 0;
  const minPrice = totalProducts
    ? Math.min(...products.map((p) => Number(p.price || 0)))
    : 0;

  return (
    <div className="container ">
      <h2 className="mb-3 fw-bold">Product Management</h2>

      {/* === Stats Section === */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Products</h5>
              <p className="card-text fs-4 fw-bold">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <p className="card-text fs-4 fw-bold">{totalCategories}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Sellers</h5>
              <p className="card-text fs-4 fw-bold">{totalSellers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Avg. Price</h5>
              <p className="card-text fs-4 fw-bold">${avgPrice}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Max Price</h5>
              <p className="card-text fs-4 fw-bold">${maxPrice}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Min Price</h5>
              <p className="card-text fs-4 fw-bold">${minPrice}</p>
            </div>
          </div>
        </div>
      </div>

      {/* === Search + Filter === */}
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

      {/* === Product Table === */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Seller</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{
                      width: "70px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{p.title}</td>
                <td>{getCategoryName(p.categoryId)}</td>
                <td>{getSellerName(p.sellerId)}</td>
                <td>${p.price}</td>
                <td>
                  <Link
                    to={`/admin/product/${p.id}`}
                    className="btn btn-sm btn-info me-2"
                  >
                    Details
                  </Link>
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
              <td colSpan="7" className="text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProduct;
