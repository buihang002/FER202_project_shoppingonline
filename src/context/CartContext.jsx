import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [cartDetails, setCartDetails] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Hàm để lấy dữ liệu giỏ hàng và chi tiết sản phẩm
    const fetchCartData = async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        try {
            const cartRes = await fetch(`http://localhost:9999/carts?userId=${currentUser.id}`);
            const cartData = await cartRes.json();
            
            if (cartData.length > 0) {
                const userCart = cartData[0];
                setCart(userCart);
                
                if (userCart.items && userCart.items.length > 0) {
                    const productPromises = userCart.items.map(item =>
                        fetch(`http://localhost:9999/products/${item.productId}`).then(res => res.json())
                    );
                    const products = await Promise.all(productPromises);
                    
                    const details = userCart.items.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        return product ? { ...product, quantity: item.quantity } : null;
                    }).filter(Boolean); // Lọc bỏ các sản phẩm không tìm thấy
                    setCartDetails(details);
                } else {
                    setCartDetails([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch cart data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    const updateCartOnServer = async (cartId, updatedItems) => {
        const response = await fetch(`http://localhost:9999/carts/${cartId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: updatedItems })
        });
        return response.json();
    };

    // --- LOGIC ADD TO CART ĐÃ ĐƯỢC VIẾT LẠI HOÀN CHỈNH ---
    const addToCart = async (product) => {
        if (!currentUser) {
            alert('Please log in to add items to your cart.');
            return;
        }

        const newItem = { productId: product.id, quantity: 1 };

        // Trường hợp 1: Người dùng chưa có giỏ hàng
        if (!cart) {
            const newCartPayload = {
                id: `cart-${currentUser.id}-${Date.now()}`,
                userId: currentUser.id,
                items: [newItem],
            };
            const response = await fetch('http://localhost:9999/carts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCartPayload)
            });
            await response.json();
            await fetchCartData(); // Tải lại dữ liệu giỏ hàng
            alert(`${product.title} has been added to your cart!`);
            return;
        }

        // Trường hợp 2: Người dùng đã có giỏ hàng
        const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
        let updatedItems;

        if (existingItemIndex > -1) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            updatedItems = cart.items.map((item, index) => 
                index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            // Nếu sản phẩm chưa có, thêm vào giỏ
            updatedItems = [...cart.items, newItem];
        }
        
        await updateCartOnServer(cart.id, updatedItems);
        await fetchCartData(); // Tải lại dữ liệu giỏ hàng
        alert(`${product.title} has been added to your cart!`);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedItems = cart.items.map(item => 
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
        updateCartOnServer(cart.id, updatedItems).then(() => fetchCartData());
    };

    const removeFromCart = (productId) => {
        const updatedItems = cart.items.filter(item => item.productId !== productId);
        updateCartOnServer(cart.id, updatedItems).then(() => fetchCartData());
    };
    
    const clearCart = () => {
        updateCartOnServer(cart.id, []).then(() => fetchCartData());
    };

    const toggleItemSelected = (productId) => {
        setSelectedItems(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId) 
                : [...prev, productId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === cartDetails.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartDetails.map(item => item.id));
        }
    };

    const isAllSelected = cartDetails.length > 0 && selectedItems.length === cartDetails.length;

    const orderSummary = cartDetails
        .filter(item => selectedItems.includes(item.id))
        .reduce((summary, item) => {
            summary.selectedCount += 1;
            summary.subtotal += item.price * item.quantity;
            summary.total += item.price * item.quantity;
            return summary;
        }, { selectedCount: 0, subtotal: 0, total: 0 });

    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const value = {
        cart,
        cartDetails,
        itemCount,
        loading,
        selectedItems,
        isAllSelected,
        orderSummary,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleItemSelected,
        toggleSelectAll
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
