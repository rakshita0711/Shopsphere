import BankTransaction from "../models/BankTransaction.js";

export const getBankTransactions = async (req, res) => {
  const data = await BankTransaction.find()
    .populate({
      path: "bankAccountId",
      populate: { path: "bankId" },
    })
    .sort({ date: -1 });

  res.json(data);
};

export const createBankTransaction = async (req, res) => {
  try {
    const tx = new BankTransaction(req.body);
    await tx.save();
    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const updateBankTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await BankTransaction.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json("Transaction not found");
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to update transaction");
  }
};

export const deleteBankTransaction = async (req, res) => {
  await BankTransaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
