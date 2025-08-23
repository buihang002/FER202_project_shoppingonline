import React from 'react';
import { Heart } from 'lucide-react';

const StarRating = ({ rating = 0, reviews = 0 }) => (
    <div className="d-flex align-items-center small text-muted">
        <span>⭐</span>
        <span className="ms-1">{rating.toFixed(1)} ({reviews} reviews)</span>
    </div>
);

const ProductCard = ({ product }) => {
    return (
        <div className="col">
            <div className="card h-100 shadow-sm">
                <div className="position-relative">
                    <img src={product.image || 'https://placehold.co/600x400'} className="card-img-top" alt={product.title} style={{ height: '200px', objectFit: 'cover' }} />
                    {product.tag && (
                        <span className="badge bg-primary position-absolute top-0 start-0 m-2">{product.tag}</span>
                    )}
                    <button className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle">
                        <Heart size={16} />
                    </button>
                </div>
                <div className="card-body d-flex flex-column">
                    <p className="small text-primary mb-1">{product.category || 'Uncategorized'}</p>
                    <h5 className="card-title fs-6 fw-bold">{product.title}</h5>
                    <StarRating rating={product.rating} reviews={product.reviews} />
                    <p className="card-text small text-muted my-2 flex-grow-1">{product.description}</p>
                    <div className="mt-auto">
                        <p className="fs-5 fw-bolder text-primary mb-1">$:{product.price ? `${product.price.toFixed(2)}` : 'N/A'}</p>
                        {/* Hiển thị tên người bán thay vì ID */}
                        <p className="small text-muted mb-2">By {product.sellerName || 'Unknown'}</p>
                        <div className="d-grid">
                            <button className="btn btn-primary">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
