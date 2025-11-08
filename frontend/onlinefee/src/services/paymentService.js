import api from "./api";

export const createOrder = async (payload) => {
  const res = await api.post("/payment/create-order", payload);
  return res.data;
};

export const verifyPayment = async (payload) => {
  const res = await api.post("/payment/verify", payload);
  return res.data;
};
