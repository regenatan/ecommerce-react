import React, { useEffect } from 'react';
import { useCart } from "./CartStore";
import { useJwt } from "./UserStore";

export default function ShoppingCartPage() {
  const {
    cart,
    fetchCart,
    modifyQuantity,
    removeFromCart,
    addToCart,
    isLoading,
  } = useCart();

  const { getJwt } = useJwt();

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Shopping Cart</h1>
      {isLoading ? (
        <p>Loading cart...</p>
      ) : cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul className="list-group">
          {cart.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{item.product_name}</h5>
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  width="100"
                  className="me-3"
                />
                <div className="d-flex align-items-center mt-2">
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() =>
                      modifyQuantity(item.product_id, item.quantity - 1)
                    }
                    disabled={isLoading || item.quantity <= 1}
                  >
                    -
                  </button>
                  <p className="mb-0">Quantity: {item.quantity}</p>
                  <button
                    className="btn btn-sm btn-secondary ms-2"
                    onClick={() =>
                      modifyQuantity(item.product_id, item.quantity + 1)
                    }
                    disabled={isLoading}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-sm btn-danger ms-2"
                    onClick={() => removeFromCart(item.product_id)}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
