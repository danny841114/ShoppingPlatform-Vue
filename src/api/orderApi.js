import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export const orderApi = {
  addOrder(
    cartIds,
    vendorId,
    receiverName,
    receiverPhone,
    receiverEmail,
    receiverAddress,
    paymentMethod,
    note,
    shippingFee
  ) {
    return apiClient.post(
      "",
      {
        cartIds,
        vendorId,
        receiverName,
        receiverPhone,
        receiverEmail,
        receiverAddress,
        paymentMethod,
        note,
        shippingFee,
      },
      { withCredentials: true }
    );
  },

  getOrders(memberId, vendorId) {
    return apiClient.get("", {
      params: { memberId, vendorId },
      withCredentials: true,
    });
  },
};
