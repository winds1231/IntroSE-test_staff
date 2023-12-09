import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { getStorage } from "../../services/getStorageService";
import { editStorage } from "../../services/editStorageService";
import { deleteStorage } from "../../services/deleteStorageService";
import "./style.css";

function Storage() {
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
      const storageData = await getStorage();

      if (storageData && storageData.storageDetails) {
        setItems(storageData.storageDetails);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors as needed
    }
  };

  const handleEditItem = (index) => {
    if (editingRowIndex !== null) return;
    setEditingRowIndex(index);
  };

  const handleSaveItem = async (index) => {
    try {
      const updatedItem = {
        ...items[index],
        tp_id: parseInt(document.getElementById(`tp_id-${index}`).innerText),
        item: document.getElementById(`item-${index}`).innerText,
        cost: parseFloat(document.getElementById(`cost-${index}`).value),
        price: parseFloat(document.getElementById(`price-${index}`).value),
        quantity: parseInt(document.getElementById(`quantity-${index}`).value),
        //hsd: document.getElementById(`hsd-${index}`).innerText,
        hsd: formatDateForSaving(document.getElementById(`hsd-${index}`).value),
      };

      const updatedItems = [...items];
      updatedItems[index] = updatedItem;
      setItems(updatedItems);

      await editStorage(
        updatedItem.tp_id,
        updatedItem.item,
        updatedItem.cost,
        updatedItem.price,
        null,
        updatedItem.quantity,
        null,
        updatedItem.hsd
      );

      setEditingRowIndex(null);
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };


  const handleDeleteItem = async (index) => {
    try {
      const updatedItem = {
        ...items[index],
        tp_id: parseInt(document.getElementById(`tp_id-${index}`).innerText),
      };

      await deleteStorage(updatedItem.tp_id);
      window.location.reload();
    } catch (error) {
      console.error("Error transferring item:", error);
    }
  };

  const addNewItem = () => {
    setItems([...items, { item: "", quantity: 0, cost: 0, hsd: "" }]);
  };

  const formatDateForSaving = (dateString) => {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return "";
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const isEmpty = (quantity) => {
    return quantity <= 0;
  };

  const stillExpired = (dateString) => {
    const currentDate = new Date();
    const selectedDate = new Date(dateString);
    return selectedDate < currentDate;
  };

  const rowClass = (index) => {
    const item = items[index];
    if (isEmpty(item.quantity)) {
      return "red-highlight"; // Highlight if quantity is empty
    } else if (stillExpired(item.hsd)) {
      return "expired-highlight"; // Highlight if the date is still expired
    } else {
      return ""; // No highlight
    }
  };

  return (
    <div className="storage">
      <Button primary to="/invoice">
        Nhập hàng
      </Button>
      <h2>Danh sách Hàng Hóa</h2>
      <table>
        <thead>
          <tr>
            <th>tp_id</th>
            <th>Tên Hàng Hóa</th>
            <th>Giá bán</th>
            <th>Giá nhập</th>
            <th>Số lượng tồn</th>
            <th>Hạn sử dụng</th>
            <th>Edit</th>
            <th>Save</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className={rowClass(index)}>
              <td id={`tp_id-${index}`}>{item.tp_id}</td>
              <td
                id={`item-${index}`}
                contentEditable={editingRowIndex === index}
              >
                {item.item}
              </td>
              <td>
                <input
                  id={`price-${index}`}
                  type="number"
                  defaultValue={item.price}
                  readOnly={editingRowIndex !== index}
                />
              </td>
              <td>
                <input
                  id={`cost-${index}`}
                  type="number"
                  defaultValue={item.cost}
                  readOnly={editingRowIndex !== index}
                />
              </td>
              <td>
                <input
                  id={`quantity-${index}`}
                  type="number"
                  defaultValue={item.quantity}
                  readOnly={editingRowIndex !== index}
                />
              </td>

              <td>
                <input
                  id={`hsd-${index}`}
                  type="text"
                  defaultValue={formatDateString(item.hsd)}
                  readOnly={editingRowIndex !== index}
                  placeholder="dd/mm/yyyy"
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
                  <Button cell_button onClick={() => handleSaveItem(index)}>
                    Save
                  </Button>
                )}
              </td>
              <td>
                <Button cell_button onClick={() => handleDeleteItem(index)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Storage;
