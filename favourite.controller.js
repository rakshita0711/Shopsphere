import Favourite from "../models/Favourite.js";

/* ================= GET USER FAVOURITES ================= */
export const getUserFavourites = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await Favourite.find({ userId })
      .populate("productId");

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to load favourites");
  }
};

/* ================= ADD FAVOURITE ================= */
export const addFavourite = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const fav = new Favourite({ userId, productId });
    await fav.save();

    res.status(201).json({ message: "Added to favourites" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json("Already in favourites");
    }
    console.error(err);
    res.status(500).json("Failed to add favourite");
  }
};

/* ================= REMOVE FAVOURITE ================= */
export const removeFavourite = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    await Favourite.findOneAndDelete({ userId, productId });

    res.json({ message: "Removed from favourites" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to remove favourite");
  }
};
