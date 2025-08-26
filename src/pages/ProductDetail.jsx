import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Đã sửa lại đường dẫn import theo cấu trúc thư mục mới
import NavHome from '../components/Home/NavHome';
import Footer from '../components/Home/Footer';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProductData = async () => {
            setLoading(true);
            setError(null);
            try {
                const productRes = await fetch(`http://localhost:9999/products/${productId}`);
                if (!productRes.ok) {
                    throw new Error('Could not find the product. Please check the product ID.');
                }
                const productData = await productRes.json();
                
                if (!productData || !productData.id) {
                    throw new Error('Received invalid product data from the server.');
                }
                setProduct(productData);

                if (productData.sellerId) {
                    const sellerRes = await fetch(`http://localhost:9999/users/${productData.sellerId}`);
                    if (sellerRes.ok) {
                        const sellerData = await sellerRes.json();
                        setSeller(sellerData);
                    }
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching product details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    if (loading) {
        return (
            <>
                <NavHome />
                <div className="text-center my-5 p-5">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3">Loading Product...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !product) {
        return (
             <>
                <NavHome />
                <div className="container my-5">
                    <div className="alert alert-danger text-center">
                        <h4>Oops! Something went wrong.</h4>
                        <p>{error || "The product you are looking for does not exist."}</p>
                        <Link to="/" className="btn btn-primary">Go back to Home</Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavHome />
            <main className="container flex-grow-1 my-5">
                <div className="card shadow-sm border-0">
                    <div className="card-body p-lg-5">
                        <div className="row g-5">
                            <div className="col-lg-6">
                                <img src={product.image} alt={product.title} className="img-fluid rounded shadow-sm" />
                            </div>
                            <div className="col-lg-6 d-flex flex-column">
                                <h1 className="fw-bold display-5">{product.title}</h1>
                                <div className="d-flex align-items-center my-3">
                                    <div className="d-flex text-warning">
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} />
                                    </div>
                                    <span className="ms-2 text-muted">(4.0 stars from 25 reviews)</span>
                                </div>
                                
                                <p className="display-4 fw-bold text-primary my-4">${product.price.toFixed(2)}</p>

                                <div className="d-grid gap-2 mt-auto">
                                    <button onClick={() => addToCart(product)} className="btn btn-primary btn-lg d-flex align-items-center justify-content-center">
                                        <ShoppingCart className="me-2" /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                        {seller && (
                            <div className="mt-5 pt-5 border-top">
                                <h4 className="fw-bold mb-4">About the Seller</h4>
                                <div className="d-flex align-items-center bg-white p-3 rounded border">
                                    <img 
                                        src={seller.avatarURL || 'https://placehold.co/60x60/EFEFEF/AAAAAA&text=No+Image'} 
                                        alt={seller.fullname} 
                                        className="rounded-circle me-3" 
                                        width="60" 
                                        height="60" 
                                    />
                                    <div>
                                        <h5 className="fw-bold mb-0">{seller.fullname}</h5>
                                        <p className="text-muted mb-0">{seller.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-5 pt-5 border-top">
                            <h4 className="fw-bold mb-4">Product Description</h4>
                            <p className="text-muted lh-lg">{product.description}</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetail;
