import api from "./api";

/**
 * Get all transactions for a user
 */
export const getUserTransactions = async (userId) => {
  const res = await api.get(`/payment/transactions/user/${userId}`);
  return res.data;
};

/**
 * Get all transactions (with optional email filter)
 */
export const getAllTransactions = async (email = null) => {
  const url = email ? `/payment/transactions?email=${email}` : "/payment/transactions";
  const res = await api.get(url);
  return res.data;
};

/**
 * Get transaction by ID
 */
export const getTransactionById = async (id) => {
  const res = await api.get(`/payment/transaction/${id}`);
  return res.data;
};
