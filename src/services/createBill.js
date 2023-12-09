import axios from "axios";

const createBill = async (nv_id, ngaylap, tongtien) => {
  try {
    const response = await axios.post("http://localhost:8000/api/sale/create", {
      nv_id: nv_id,
      ngaylap: ngaylap,
      tongtien: tongtien,
    });
    console.log(response);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);

    if (error.response && error.response.data) {
      console.error("Error response data:", error.response.data);
    }

    throw error;
  }
};

export { createBill };
