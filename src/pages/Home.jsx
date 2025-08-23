import React, { useState, useEffect } from 'react';
import NavHome from '../components/Home/NavHome';
import SideBar from '../components/Home/Sidebar'
import ProductCard from '../components/Home/ProductCard';
import Footer from '../components/Home/Footer';

const Home = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]); // <-- State mới để lưu danh sách người dùng
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortOption, setSortOption] = useState('default');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy đồng thời cả 3 nguồn dữ liệu
                const [productsRes, categoriesRes, usersRes] = await Promise.all([
                    fetch('http://localhost:9999/products'),
                    fetch('http://localhost:9999/categories'),
                    fetch('http://localhost:9999/users')
                ]);
                if (!productsRes.ok || !categoriesRes.ok || !usersRes.ok) {
                    throw new Error('Failed to fetch data');
                }
                
                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();
                const usersData = await usersRes.json();

                setAllProducts(productsData);
                setCategories(categoriesData);
                setUsers(usersData); // <-- Lưu dữ liệu người dùng
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let productsToProcess = [...allProducts];

        if (selectedCategories.length > 0) {
            productsToProcess = productsToProcess.filter(product => 
                selectedCategories.includes(product.categoryId)
            );
        }

        switch (sortOption) {
            case 'price-asc':
                productsToProcess.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                productsToProcess.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                productsToProcess.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                productsToProcess.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                productsToProcess.sort((a, b) => a.id.localeCompare(b.id));
                break;
        }

        setDisplayedProducts(productsToProcess);
    }, [selectedCategories, sortOption, allProducts]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId) 
                : [...prev, categoryId]
        );
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
    };

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const getCategoryNameById = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Uncategorized';
    };

    // <-- Hàm mới để lấy tên người bán từ ID
    const getSellerNameById = (sellerId) => {
        const seller = users.find(user => user.id === sellerId);
        return seller ? seller.fullname : 'Unknown Seller';
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavHome />
            <main className="container flex-grow-1 my-5">
                <div className="row g-5">
                    <div className="col-lg-3">
                        <SideBar 
                            selectedCategories={selectedCategories}
                            onCategoryChange={handleCategoryChange}
                            onClearFilters={handleClearFilters}
                            sortOption={sortOption}
                            onSortChange={handleSortChange}
                        />
                    </div>
                    <div className="col-lg-9">
                        <h2 className="fw-bold mb-2 text-3xl">Discover Products</h2>
                        {loading && <div className="text-center p-5"><div className="spinner-border text-primary" /></div>}
                        {error && <div className="alert alert-danger">Error: {error}</div>}
                        {!loading && !error && (
                            <>
                                <p className="text-muted mb-4">Showing {displayedProducts.length} of {allProducts.length} products</p>
                                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                                    {displayedProducts.map((product) => (
                                        <ProductCard 
                                            key={product.id} 
                                            product={{ 
                                                ...product, 
                                                category: getCategoryNameById(product.categoryId),
                                                // Thêm tên người bán vào đối tượng product
                                                sellerName: getSellerNameById(product.sellerId) 
                                            }} 
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;