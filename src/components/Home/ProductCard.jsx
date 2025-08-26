import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Import useCart hook

const ProductCard = ({ product }) => {
    const { addToCart } = useCart(); // Lấy hàm addToCart từ context

    // Hàm xử lý khi nhấn nút "Add to Cart"
    const handleAddToCart = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của Link (chuyển trang)
        e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ Link cha
        addToCart(product);
    };

    return (
        <Link to={`/product/${product.id}`} className="col text-decoration-none text-dark">
            <div className="card h-100 shadow-sm border-0 transition-transform transform hover:scale-105">
                <div className="position-relative">
                    <img src={product.image || 'https://placehold.co/600x400'} className="card-img-top" alt={product.title} style={{ height: '200px', objectFit: 'cover' }} />
                    <button className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle">
                        <Heart size={16} />
                    </button>
                </div>
                <div className="card-body d-flex flex-column">
                    <p className="small text-primary mb-1">{product.category || 'Uncategorized'}</p>
                    <h5 className="card-title fs-6 fw-bold flex-grow-1">{product.title}</h5>
                    
                    <div className="mt-auto">
                        <p className="fs-5 fw-bolder text-primary mb-1">$:{product.price ? `${product.price.toFixed(2)}` : 'N/A'}</p>
                        {/* Hiển thị tên người bán thay vì ID */}

                        <p className="small text-muted mb-2">By {product.sellerName || 'Unknown'}</p>
                        <div className="d-grid">
                            <button onClick={handleAddToCart} className="btn btn-primary">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
