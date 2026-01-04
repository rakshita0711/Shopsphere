const UserNavbar = ({
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedDate,
  setSelectedDate,
  cartCount,
  user,
  setPage,
  setShowOrders,
  setShowFavourites,
}) => {
  return (
    <div className="pos-navbar">
      <div className="nav-left">
        <strong className="brand">ShopSphere</strong>
      </div>

      <div className="nav-center">
        <input
          className="nav-search"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="nav-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="nav-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="nav-right">
        <button
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => setShowOrders(true)}
        >
          Orders
        </button>

        <button
          className="btn btn-sm btn-outline-danger me-2"
          onClick={() => setShowFavourites(true)}
        >
          ❤️ Favourites
        </button>

        <span className="nav-user">Hi, {user?.name}</span>

        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => {
            localStorage.clear();
            setPage("login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserNavbar;
