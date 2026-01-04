import { useEffect, useState } from "react";
import { api } from "../services/api";

const FavouriteModal = ({ userId, onClose, addToCart }) => {
  const [favourites, setFavourites] = useState([]);

  const loadFavourites = async () => {
    const res = await api.get(`/favourites/${userId}`);
    setFavourites(res.data);
  };

  useEffect(() => {
    loadFavourites();
  }, []);

  const removeFavourite = async (productId) => {
    await api.delete(`/favourites/${productId}/${userId}`);
    loadFavourites();
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>My Favourites ❤️</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {favourites.length === 0 && (
              <p className="text-muted">No favourite products</p>
            )}

            <div className="row">
              {favourites.map((f) => (
                <div key={f.productId._id} className="col-md-4 mb-3">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={f.productId.image}
                      alt={f.productId.name}
                      className="product-image"
                    />

                    <div className="card-body text-center">
                      <h6>{f.productId.name}</h6>
                      <p className="text-success fw-bold">
                        ₹ {f.productId.price}
                      </p>

                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => addToCart(f.productId)}
                      >
                        Add to Cart
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          removeFavourite(f.productId._id)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavouriteModal;
