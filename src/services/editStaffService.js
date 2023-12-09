import axios from 'axios';


const editStaff = async (staff_id, hoten, gioitinh, sdt, luong) => {
  try {
    const response = await axios.post('http://localhost:8000/staff/edit', {
      staff_id: staff_id,
      hoten: hoten,
      gioitinh: gioitinh,
      sdt: sdt,
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

export { editStaff };
