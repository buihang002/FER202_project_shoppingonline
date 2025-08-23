import React, { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';

const SideBar = ({ selectedCategories, onCategoryChange, onClearFilters, sortOption, onSortChange }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:9999/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <>
            {/* Filter by Categories */}
            <aside className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                    <h5 className="d-flex align-items-center card-title fw-bold mb-3 border-bottom pb-3">
                        <SlidersHorizontal size={20} className="me-2 text-primary" /> Filters
                    </h5>
                    <h6 className="fw-semibold mb-3">Categories</h6>
                    {categories.map((category) => (
                        <div className="form-check mb-2" key={category.id}>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id={`cat-${category.id}`}
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => onCategoryChange(category.id)}
                            />
                            <label className="form-check-label" htmlFor={`cat-${category.id}`}>
                                {category.name}
                            </label>
                        </div>
                    ))}
                    <div className="d-grid mt-4">
                        <button onClick={onClearFilters} className="btn btn-outline-primary">
                            CLEAR FILTERS
                        </button>
                    </div>
                </div>
            </aside>

            {/* Sort By */}
            <aside className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <h5 className="d-flex align-items-center card-title fw-bold mb-3 border-bottom pb-3">
                        <SlidersHorizontal size={20} className="me-2 text-primary" /> Sort By
                    </h5>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="radio" name="sortOptions" id="sortDefault" value="default" checked={sortOption === 'default'} onChange={(e) => onSortChange(e.target.value)} />
                        <label className="form-check-label fw-bold" htmlFor="sortDefault">Default</label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="radio" name="sortOptions" id="sortLowHigh" value="price-asc" checked={sortOption === 'price-asc'} onChange={(e) => onSortChange(e.target.value)} />
                        <label className="form-check-label" htmlFor="sortLowHigh">Price: Low to High</label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="radio" name="sortOptions" id="sortHighLow" value="price-desc" checked={sortOption === 'price-desc'} onChange={(e) => onSortChange(e.target.value)} />
                        <label className="form-check-label" htmlFor="sortHighLow">Price: High to Low</label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="radio" name="sortOptions" id="sortAZ" value="name-asc" checked={sortOption === 'name-asc'} onChange={(e) => onSortChange(e.target.value)} />
                        <label className="form-check-label" htmlFor="sortAZ">Name: A to Z</label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="radio" name="sortOptions" id="sortZA" value="name-desc" checked={sortOption === 'name-desc'} onChange={(e) => onSortChange(e.target.value)} />
                        <label className="form-check-label" htmlFor="sortZA">Name: Z to A</label>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SideBar;
