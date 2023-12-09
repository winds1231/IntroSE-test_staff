import axios from 'axios';

const editInvoice = async (dnh_id, tp_id, item, cost, quantity, date) => {
  try {
    const response = await axios.post('http://localhost:8000/invoice/edit', {
      dnh_id: dnh_id,
      tp_id: tp_id,
      item: item,
      cost: cost,
      quantity: quantity,
      date: date
    });
    console.log(response);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error occurred:', error);
    
    if (error.response && error.response.data) {
      console.error('Error response data:', error.response.data);
    }
    
    throw error;
  }
};

export { editInvoice };
