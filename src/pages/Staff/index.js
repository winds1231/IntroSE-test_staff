import React, { useState, useEffect } from "react";
import { getStaff } from "../../services/getStaffService";
import { editStaff } from "../../services/editStaffService";
import { deleteStaff } from "../../services/deleteStaffService";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Button from "~/components/Button";

function Staff() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else if (token !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const [items, setItems] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const staffData = await getStaff();
      setItems(staffData.Staffs || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditItem = (index) => {
    if (editingRowIndex !== null) return;
    setEditingRowIndex(index);
  };

  const handleSaveItem = async (index) => {
    try {
      // Extract updated data from the contentEditable elements or input fields
      const updatedItem = {
        ...items[index],
        nv_id: parseInt(document.getElementById(`nv_id-${index}`).innerText),
        password: document.getElementById(`password-${index}`).innerText,
        hoten: document.getElementById(`hoten-${index}`).innerText,
        gioitinh: parseInt(document.getElementById(`gioitinh-${index}`).innerText),
        luong: parseFloat(document.getElementById(`luong-${index}`).value),
      };
  
      // Update the local state with the updated item
      const updatedItems = [...items];
      updatedItems[index] = updatedItem;
      setItems(updatedItems);
  
      // Make a request to edit the staff member using the editStaff function
      await editStaff(
        updatedItem.nv_id,
        updatedItem.password,
        updatedItem.hoten,
        updatedItem.gioitinh,
        updatedItem.luong
      );
  
      // Reset the editingRowIndex to exit the editing mode
      setEditingRowIndex(null);
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const handleDeleteItem = async (nv_id, index) => {
    try {
      await deleteStaff(nv_id);
      const updatedItems = [...items];
      updatedItems.splice(index, 1); // Xoá phần tử đã bị xóa khỏi mảng items
      setItems(updatedItems); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSalaryChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].luong = parseFloat(value);
    setItems(updatedItems);
  };

  const rowClass = (index) => {
    return editingRowIndex === index ? "editing-row" : "";
  };

  return (
    <div className="Staff">
      <Button primary onClick={() => navigate('/insert-staff')}>
        Nhập nhân viên
      </Button>
      <h2>Danh sách Nhân viên</h2>
      <table>
        <thead>
          <tr>
            <th>Nv_id</th>
            <th>Họ tên</th>
            <th>Giới tính</th>
            <th>Lương</th>
            <th>Edit</th>
            <th>Save</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className={rowClass(index)}>
              <td
                id={`nv_id-${index}`}
                contentEditable={editingRowIndex === index}
              >
                {item.nv_id}
              </td>
              <td
                id={`hoten-${index}`}
                contentEditable={editingRowIndex === index}
              >
                {item.hoten}
              </td>
              <td
                id={`gioitinh-${index}`}
                contentEditable={editingRowIndex === index}
              >
                {item.gioitinh}
              </td>
              <td>
                <input
                  id={`luong-${index}`}
                  type="number"
                  value={item.luong}
                  readOnly={editingRowIndex !== index}
                  onChange={(e) => handleSalaryChange(index, e.target.value)}
                />
              </td>
              <td>
                <Button
                  cell_button
                  onClick={() => handleEditItem(index)}
                  disabled={editingRowIndex !== null}
                >
                  Edit
                </Button>
              </td>
              <td>
                {editingRowIndex === index && (
                  <Button
                    cell_button
                    onClick={() => handleSaveItem(index)}
                  >
                    Save
                  </Button>
                )}
              </td>
              <td>
                <Button
                  cell_button
                  onClick={() => handleDeleteItem(item.nv_id, index)}
                  disabled={editingRowIndex === index}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Staff;
