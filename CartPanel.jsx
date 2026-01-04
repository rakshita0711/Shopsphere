import React from "react";

const CartPanel = ({
  cart,
  increaseQty,
  decreaseQty,
  total,
  onPlaceOrder,
  clearCart,
}) => {
  const isCartEmpty = cart.length === 0;

  return (
    <div className="col-md-4">
      <div className="card shadow-sm sticky-top" style={{ top: 90 }}>
        <div className="card-body">
          <h5>Order Summary</h5>

          {isCartEmpty && <p className="text-muted">No items added</p>}

          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-top">
                <span className="item-name">{item.name}</span>

                <div className="qty-inline">
                  <button onClick={() => decreaseQty(item._id)}>−</button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item._id)}
                    disabled={item.qty >= item.quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-price">₹ {item.qty * item.price}</div>
            </div>
          ))}

          <hr />

          <div className="d-flex justify-content-between fs-5">
            <strong>Total</strong>
            <strong>₹ {total}</strong>
          </div>

          {/* PLACE ORDER */}
          <button
            className="btn btn-success w-100 mt-3"
            onClick={onPlaceOrder}
            disabled={isCartEmpty}
          >
            Place Order
          </button>

          {/* CLEAR CART */}
          <button
            className="btn btn-outline-secondary w-100 mt-2"
            onClick={clearCart}
            disabled={isCartEmpty}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
