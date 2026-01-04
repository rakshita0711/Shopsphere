import { useState, useEffect } from "react";

const ProductGrid = ({ products, favourites, toggleFavourite, addToCart }) => {
  const [quickView, setQuickView] = useState(null);

  /* ================= TOAST ================= */
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  /* ================= RATINGS (1–5 ONLY) ================= */
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ratings")) || {};
    setRatings(stored);
  }, []);

  const saveRating = (productId, value) => {
    const updated = { ...ratings };
    if (!updated[productId]) updated[productId] = [];
    updated[productId].push(Number(value));

    setRatings(updated);
    localStorage.setItem("ratings", JSON.stringify(updated));

    showToast("⭐ Thank you for your review!");
  };

  const getAvgRating = (productId) => {
    const list = ratings[productId];
    if (!list || list.length === 0) return 0;
    return Math.round(
      list.reduce((sum, r) => sum + r, 0) / list.length
    );
  };

  /* ================= BADGES ================= */
  const avgPrice =
    products.reduce((sum, p) => sum + p.price, 0) /
    (products.length || 1);

  const getBadge = (product) => {
    if (product.quantity === 0)
      return { text: "OUT OF STOCK", color: "bg-dark" };
    if (product.quantity < 5)
      return { text: "LOW STOCK", color: "bg-danger" };

    const daysOld =
      (Date.now() - new Date(product.createdAt || Date.now())) /
      (1000 * 60 * 60 * 24);

    if (daysOld <= 7)
      return { text: "NEW", color: "bg-success" };

    if (product.price < avgPrice)
      return { text: "TRENDING", color: "bg-warning text-dark" };

    return null;
  };

  /* ================= OPEN MODAL ================= */
  const openProduct = (product) => {
    setQuickView(product);
  };

  /* ================= NOTIFY ================= */
  const notifyMe = (product) => {
    const stored = JSON.parse(localStorage.getItem("notifyList")) || [];
    if (stored.find((p) => p._id === product._id)) {
      showToast("🔔 Already subscribed");
      return;
    }
    stored.push({
      _id: product._id,
      name: product.name,
      notified: false,
    });
    localStorage.setItem("notifyList", JSON.stringify(stored));
    showToast("🔔 You’ll be notified when stock is back");
  };

  /* ================= RECOMMEND ================= */
  const getRecommendations = (product) =>
    products
      .filter(
        (p) =>
          p.categoryId?._id === product.categoryId?._id &&
          p._id !== product._id
      )
      .slice(0, 4);

  return (
    <div className="col-md-8 position-relative">

      {/* ===== TOAST ===== */}
      {toast && (
        <div
          className="position-fixed top-0 end-0 m-3 alert alert-success shadow"
          style={{ zIndex: 3000 }}
        >
          {toast}
        </div>
      )}

      <div className="row">
        {products.map((p) => {
          const badge = getBadge(p);
          const isOutOfStock = p.quantity === 0;
          const rating = getAvgRating(p._id);

          return (
            <div key={p._id} className="col-md-3 mb-4">
              <div
                className={`card product-card position-relative ${
                  isOutOfStock ? "opacity-75" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => openProduct(p)}
              >
                {badge && (
                  <span
                    className={`badge ${badge.color} position-absolute top-0 start-0 m-2`}
                  >
                    {badge.text}
                  </span>
                )}

                {/* FAVOURITE */}
                <button
                  className={`fav-btn ${
                    favourites[p._id] ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(p._id);
                  }}
                >
                  ♥
                </button>

                <img src={p.image} className="product-image" />

                <div className="card-body text-center">
                  <h6>{p.name}</h6>

                  {/* ⭐ RATING */}
                  <div className="text-warning small">
                    {"★".repeat(rating)}
                    {"☆".repeat(5 - rating)}
                  </div>

                  <p className="text-success fw-bold mt-1">
                    ₹ {p.price}
                  </p>

                  {isOutOfStock ? (
                    <button
                      className="btn btn-outline-warning btn-sm w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        notifyMe(p);
                      }}
                    >
                      🔔 Notify Me
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                        showToast("🛒 Added to cart");
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= PRODUCT MODAL ================= */}
      {quickView && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{quickView.name}</h5>
                <button
                  className="btn-close"
                  onClick={() => setQuickView(null)}
                />
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 text-center">
                    <img
                      src={quickView.image}
                      style={{ maxHeight: 220 }}
                    />
                    <h4 className="text-success mt-2">
                      ₹ {quickView.price}
                    </h4>

                    <p className="text-muted">
                      Available Quantity:{" "}
                      <strong>{quickView.quantity}</strong>
                    </p>

                    {/* ⭐ RATE */}
                    <div className="my-2">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <span
                          key={r}
                          style={{
                            cursor: "pointer",
                            fontSize: 26,
                            color: "gold",
                          }}
                          onClick={() =>
                            saveRating(quickView._id, r)
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {quickView.quantity === 0 ? (
                      <button
                        className="btn btn-outline-warning w-100"
                        onClick={() => notifyMe(quickView)}
                      >
                        Notify Me
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => {
                          addToCart(quickView);
                          showToast("🛒 Added to cart");
                          setQuickView(null);
                        }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>

                  {/* RECOMMENDATIONS */}
                  <div className="col-md-6">
                    <h6>You may also like</h6>
                    {getRecommendations(quickView).map((r) => (
                      <div
                        key={r._id}
                        className="d-flex align-items-center mb-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => openProduct(r)}
                      >
                        <img
                          src={r.image}
                          style={{ width: 50, height: 50 }}
                        />
                        <div className="ms-2">
                          <div>{r.name}</div>
                          <small className="text-success">
                            ₹ {r.price}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
