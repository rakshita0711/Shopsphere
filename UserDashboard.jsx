import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getStorage } from "../../utils/LocalStorage";

import UserNavbar from "../../components/UserNavbar";
import ProductGrid from "../../components/ProductGrid";
import CartPanel from "../../components/CartPanel";
import PaymentModal from "../../components/PaymentModal";
import Invoice from "../../components/Invoice";
import FavouriteModal from "../../components/FavouriteModal";
import OrdersModal from "../../components/OrdersModal";

import "../../styles/UserDashboard.css";

const UserDashboard = ({ setPage }) => {
  /* ================= SAFE USER ================= */
  const storedUser = getStorage("user");
  const user =
    typeof storedUser === "string" ? JSON.parse(storedUser) : storedUser;

  const userId = user?._id || user?.id;

  /* ================= STATE ================= */
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [cart, setCart] = useState([]);
  const [favourites, setFavourites] = useState({});
  const [showFavourites, setShowFavourites] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [address, setAddress] = useState("");
  const [bankDetails, setBankDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const [showInvoice, setShowInvoice] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    if (getStorage("isLoggedIn") !== "true" || getStorage("role") !== "user") {
      setPage("login");
      return;
    }

    loadProducts();
    loadCategories();
    if (userId) loadUserFavourites();
  }, [setPage, userId]);

  /* ================= API ================= */
  const loadProducts = async () => {
    const res = await api.get("/products");
    const active = res.data.filter((p) => p.active);
    setProducts(active);
    setFilteredProducts(active);
  };

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.filter((c) => c.active));
  };

  const loadUserFavourites = async () => {
    if (!userId) return;
    const res = await api.get(`/favourites/${userId}`);
    const favMap = {};
    res.data.forEach((f) => {
      if (f.productId?._id) favMap[f.productId._id] = true;
    });
    setFavourites(favMap);
  };

  /* ================= FILTER ================= */
  useEffect(() => {
    let result = products;

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.categoryId?._id === selectedCategory);
    }

    setFilteredProducts(result);
  }, [search, selectedCategory, products]);

  /* ================= CART ================= */
const addToCart = (product) => {
  const exists = cart.find((i) => i._id === product._id);

  // ❌ If already in cart & reached stock limit
  if (exists && exists.qty >= product.quantity) {
    alert("Stock limit reached");
    return;
  }

  exists
    ? setCart(
        cart.map((i) =>
          i._id === product._id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      )
    : setCart([...cart, { ...product, qty: 1 }]);
};

  // ✅ ADDED — increase quantity
  const increaseQty = (id) => {
  setCart(
    cart.map((item) => {
      const product = products.find((p) => p._id === id);

      // ❌ Stop increasing if stock reached
      if (product && item.qty >= product.quantity) {
        return item;
      }

      return item._id === id
        ? { ...item, qty: item.qty + 1 }
        : item;
    })
  );
};


  // ✅ ADDED — decrease quantity
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  /* ================= ❤️ FAVOURITES ================= */
  const toggleFavourite = async (productId) => {
    if (!userId) return;

    if (favourites[productId]) {
      await api.delete(`/favourites/${productId}/${userId}`);
    } else {
      await api.post("/favourites", { userId, productId });
    }
    loadUserFavourites();
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (!cart.length) return;

    const payload = {
      userId,
      userName: user?.name,
      orderDate: selectedDate,
      totalAmount: total,
      paymentMethod,
      upiId,
      address,
      bankDetails,
      items: cart.map((i) => ({
        productId: i._id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        status: "pending",
      })),
    };

    try {
      setLoading(true);
      const res = await api.post("/orders", payload);

      setLastOrder({
        ...payload,
        _id: res.data?.orderId || Date.now().toString(),
      });

      setShowInvoice(true);
      setCart([]);
      setShowPayment(false);
    } catch (err) {
      alert("Order failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <UserNavbar
        search={search}
        setSearch={setSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        user={user}
        setPage={setPage}
        setShowOrders={setShowOrders}
        setShowFavourites={setShowFavourites}
      />

      {/* ================= CONTENT ================= */}
      <div className="container-fluid pt-5 mt-4 px-4">
        <div className="row">
          <ProductGrid
            products={filteredProducts}
            favourites={favourites}
            toggleFavourite={toggleFavourite}
            addToCart={addToCart}
          />

          <CartPanel
            cart={cart}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
            total={total}
            onPlaceOrder={() => setShowPayment(true)}
            clearCart={() => setCart([])}
          />
        </div>
      </div>

      {/* ================= PAYMENT ================= */}
      {showPayment && (
        <PaymentModal
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          setUpiId={setUpiId}
          setAddress={setAddress}
          setBankDetails={setBankDetails}
          onConfirm={placeOrder}
          onClose={() => setShowPayment(false)}
          loading={loading}
        />
      )}

      {/* ================= ORDERS ================= */}
      {showOrders && (
        <OrdersModal
          userId={userId}
          onClose={() => setShowOrders(false)}
          onInvoice={(order) => {
            setLastOrder(order);
            setShowInvoice(true);
            setShowOrders(false);
          }}
        />
      )}

      {/* ================= FAVOURITES ================= */}
      {showFavourites && (
        <FavouriteModal
          userId={userId}
          addToCart={addToCart}
          onClose={() => setShowFavourites(false)}
        />
      )}

      {/* ================= INVOICE ================= */}
      {showInvoice && lastOrder && (
        <Invoice order={lastOrder} onClose={() => setShowInvoice(false)} />
      )}
    </>
  );
};

export default UserDashboard;
