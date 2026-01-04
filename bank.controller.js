import Bank from "../models/Bankl.js";

// GET all banks
export const getBanks = async (req, res) => {
  const banks = await Bank.find();
  res.json(banks);
};

// CREATE bank
export const createBank = async (req, res) => {
  const bank = await Bank.create(req.body);
  res.status(201).json(bank);
};

// UPDATE bank
export const updateBank = async (req, res) => {
  const bank = await Bank.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(bank);
};

// DELETE bank
export const deleteBank = async (req, res) => {
  await Bank.findByIdAndDelete(req.params.id);
  res.json({ message: "Bank deleted" });
};
