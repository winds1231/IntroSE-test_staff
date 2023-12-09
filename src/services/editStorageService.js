import axios from "axios";

const editStorage = async (
  tp_id,
  item,
  cost,
  price,
  quantity,
  quantity_update,
  date,
  hsd
) => {
  try {
    const response = await axios.post("http://localhost:8000/storage/edit", {
      tp_id: tp_id,
      item: item,
      cost: cost,
      price: price,
      quantity: quantity,
      quantity_update: quantity_update,
      date: date,
      hsd: hsd,
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

export { editStorage };
