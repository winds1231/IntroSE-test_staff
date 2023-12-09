import axios from 'axios';

const deleteStorage = async (tp_id) => {
  try {
    const response = await axios.post('http://localhost:8000/storage/delete', {
      tp_id: tp_id,
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

export { deleteStorage };
