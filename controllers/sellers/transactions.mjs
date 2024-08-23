import Transaction from "../../models/transactions.mjs";


export const addTransaction = async (req, res) => {
  const { userId, body: { orderId, reference, status, amount } } = req;

  try {
    const newTransaction = new Transaction({
      orderId,
      userId,
      reference,
      status,
      amount
    });

    await newTransaction.save();
    res.status(201).send({ message: 'Transaction recorded successfully', transaction: newTransaction });
  } catch (error) {
    res.status(500).send({ error: 'Error recording transaction' });
  }
};

export const getUserTransactions = async (req, res) => {
  const { userId } = req;

  try {
    const transactions = await Transaction.find({ userId }).populate('orderId');
    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching transactions' });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('orderId userId');
    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching transactions' });
  }
};
