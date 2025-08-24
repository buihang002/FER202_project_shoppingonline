import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../../Nav/NavBar";

const API_URL = "http://localhost:9999";

// Hàm hiển thị rating bằng sao
const renderStars = (rating) => {
  const fullStars = "★".repeat(rating);
  const emptyStars = "☆".repeat(5 - rating);
  return fullStars + emptyStars;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load product
    fetch(`${API_URL}/products/${id}`)
      .then((res) => res.json())
      .then(setProduct);

    // Load reviews
    fetch(`${API_URL}/reviews?productId=${id}`)
      .then((res) => res.json())
      .then(setReviews);

    // Load all users to map reviewer names
    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then(setUsers);
  }, [id]);

  const getReviewerName = (reviewerId) =>
    users.find((u) => u.id === reviewerId)?.fullname || "Unknown";

  if (!product) return <div className="container py-4">Loading...</div>;

  return (
    <>
      {" "}
      <NavBar />
      <div className="container py-4">
        <Link to="/admin/product" className="btn btn-secondary mb-3">
          Back to Products
        </Link>

        <div className="row mb-4">
          <div className="col-md-4 text-center">
            <img
              src={product.image}
              alt={product.title}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
          <div className="col-md-8">
            <h2>{product.title}</h2>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {product.description || "Không có mô tả"}
            </p>
            <p>
              <strong>Average Rating:</strong>{" "}
              {reviews.length > 0
                ? renderStars(
                    Math.round(
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                        reviews.length
                    )
                  )
                : "No rating yet"}
            </p>
            <p>
              <strong>Total Reviews:</strong> {reviews.length}
            </p>
          </div>
        </div>

        <h4>Reviews</h4>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Reviewer</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <tr key={r.id}>
                  <td>{getReviewerName(r.reviewerId)}</td>
                  <td>{renderStars(r.rating)}</td>
                  <td>{r.comment}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No reviews
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductDetailPage;
