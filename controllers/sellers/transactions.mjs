import Transaction from "../../models/transactions.mjs";

export const addTransaction = async (req, res) => {
  const { userId, body: { orderId, reference, status, amount } } = req;

  // Validate input
  if (!orderId || !reference || !status || typeof amount !== 'number') {
    return res.status(400).send({ error: 'All fields are required and amount must be a number' });
  }

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
    console.error('Error recording transaction:', error);
    res.status(500).send({ error: 'Error recording transaction' });
  }
};

export const getUserTransactions = async (req, res) => {
  const { userId } = req;

  if (!userId) {
    return res.status(400).send({ error: 'User ID is required' });
  }

  try {
    const transactions = await Transaction.find({ userId })
      .populate({
        path: 'orderId',
        select: 'orderDetails -_id' // Example of projection, adjust as needed
      })
      .select('-__v'); // Exclude __v field for better performance

    res.status(200).send({ transactions });
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).send({ error: 'Error fetching transactions' });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate({
        path: 'orderId',
        select: 'orderDetails -_id' // Example of projection, adjust as needed
      })
      .populate({
        path: 'userId',
        select: 'email -_id' // Example of projection, adjust as needed
      })
      .select('-__v'); // Exclude __v field for better performance

    res.status(200).send({ transactions });
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    res.status(500).send({ error: 'Error fetching transactions' });
  }
};
