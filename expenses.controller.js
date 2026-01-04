import Expense from "../models/Expense.js";

export const getExpenses = async (req, res) => {
  const data = await Expense.find()
    .populate("cashId")
    .populate({
      path: "bankAccountId",
      populate: { path: "bankId" },
    })
    .sort({ date: -1 });

  res.json(data);
};

export const createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to create expense");
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Expense.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json("Expense not found");
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to update expense");
  }
};

export const deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Expense deleted" });
};
