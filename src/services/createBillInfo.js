import axios from "axios";

const createBillInfo = async (hd_id, tp_id, quantity, price) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/sale/create-info",
      {
        hd_id: hd_id,
        tp_id: tp_id,
        quantity: quantity,
        price: price,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);

    if (error.response && error.response.data) {
      console.error("Error response data:", error.response.data);
    }

    throw error;
  }
};

export { createBillInfo };
