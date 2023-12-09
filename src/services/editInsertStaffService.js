import axios from 'axios';

const editInsertStaff = async (nv_id, hoten, gioitinh, luong) => {
  try {
    const response = await axios.post('http://localhost:8000/invoice/edit', {
      nv_id: nv_id,
      hoten: hoten,
      gioitinh: gioitinh,
      luong: luong
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

export { editInsertStaff };