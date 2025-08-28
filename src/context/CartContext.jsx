import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [cartDetails, setCartDetails] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')));
    const [loading, setLoading] = useState(true);

    // Hàm để tải lại dữ liệu giỏ hàng, sẽ được gọi khi đăng nhập/đăng xuất
    const fetchCartData = async (user) => {
        if (!user) {
            setCart(null);
            setCartDetails([]);
            setLoading(false);
            return;
        }
        try {
            const cartRes = await fetch(`http://localhost:9999/carts?userId=${user.id}`);
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
                    }).filter(Boolean);
                    setCartDetails(details);
                } else {
                    setCartDetails([]);
                }
            } else {
                setCart(null);
                setCartDetails([]);
            }
        } catch (error) {
            console.error("Failed to fetch cart data:", error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect này sẽ tự động chạy lại mỗi khi currentUser thay đổi
    useEffect(() => {
        fetchCartData(currentUser);
    }, [currentUser]);

    const login = (userData) => {
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        setCurrentUser(userData); // Cập nhật state sẽ trigger useEffect ở trên
    };

    const logout = () => {
        sessionStorage.removeItem('currentUser');
        setCurrentUser(null); // Cập nhật state sẽ trigger useEffect ở trên
    };

    const updateCartOnServer = async (cartId, updatedItems) => {
        const response = await fetch(`http://localhost:9999/carts/${cartId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: updatedItems })
        });
        return response.json();
    };

    const addToCart = async (product) => {
        if (!currentUser) {
            alert('Please log in to add items to your cart.');
            return;
        }

        const newItem = { productId: product.id, quantity: 1 };

        if (!cart) {
            const newCartPayload = {
                id: `cart-${currentUser.id}-${Date.now()}`,
                userId: currentUser.id,
                items: [newItem],
            };
            await fetch('http://localhost:9999/carts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCartPayload)
            });
        } else {
            const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
            let updatedItems;
            if (existingItemIndex > -1) {
                updatedItems = cart.items.map((item, index) => 
                    index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedItems = [...cart.items, newItem];
            }
            await updateCartOnServer(cart.id, updatedItems);
        }
        
        await fetchCartData(currentUser);
        alert(`${product.title} has been added to your cart!`);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedItems = cart.items.map(item => 
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
        updateCartOnServer(cart.id, updatedItems).then(() => fetchCartData(currentUser));
    };

    const removeFromCart = (productId) => {
        const updatedItems = cart.items.filter(item => item.productId !== productId);
        updateCartOnServer(cart.id, updatedItems).then(() => fetchCartData(currentUser));
    };
    
    const clearCart = async (itemsToRemove = null) => {
        if (!cart) return;
        let updatedItems;
        if (itemsToRemove) {
            updatedItems = cart.items.filter(item => !itemsToRemove.includes(item.productId));
        } else {
            updatedItems = [];
        }
        await updateCartOnServer(cart.id, updatedItems);
        await fetchCartData(currentUser);
        if (itemsToRemove) {
            setSelectedItems([]);
        }
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
        currentUser,
        login,
        logout,
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
