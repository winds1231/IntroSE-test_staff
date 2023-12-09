import React, { useState, useEffect } from "react";
import { getInvoice } from "../../services/getInvoiceService";
import { editInvoice } from "../../services/editInvoiceService";
import { deleteInvoice } from "../../services/deleteInvoiceService";
import { useNavigate } from "react-router-dom";
import { editStorage } from "~/services/editStorageService";
import "./style.css";
import Button from "~/components/Button";

function Invoice() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else if (token !== "admin") {
      navigate("/");
    }
  });
  const [items, setItems] = useState([]);

  const [editingRowIndex, setEditingRowIndex] = useState(null);

  useEffect(() => {
    // Fetch data from backend when the component mounts
    fetchData();
  }, []); // Empty dependency array to execute once on component mount

  const fetchData = async () => {
    try {
      const invoiceData = await getInvoice(); // Fetch data from the backend

      // Set the retrieved data to the items state
      setItems(invoiceData.invoices || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors as needed (e.g., show error message)
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
        dnh_id: parseInt(document.getElementById(`dnh_id-${index}`).innerText),
        tp_id: parseInt(document.getElementById(`tp_id-${index}`).innerText),
        item: document.getElementById(`item-${index}`).innerText,
        quantity: parseInt(document.getElementById(`quantity-${index}`).value),
        cost: parseFloat(document.getElementById(`cost-${index}`).value),
        date: formatDateForSaving(
          document.getElementById(`date-${index}`).value
        ),
      };

      const updatedItems = [...items];
      updatedItems[index] = updatedItem;
      setItems(updatedItems);

      await editInvoice(
        updatedItem.dnh_id,
        updatedItem.tp_id,
        updatedItem.item,
        updatedItem.cost,
        updatedItem.quantity,
        updatedItem.date
      );

      setEditingRowIndex(null);
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const handleTransferItem = async (index) => {
    try {
      const updatedItem = {
        ...items[index],
        tp_id: parseInt(document.getElementById(`tp_id-${index}`).innerText),
        item: document.getElementById(`item-${index}`).innerText,
        quantity: parseInt(document.getElementById(`quantity-${index}`).value),
        cost: parseFloat(document.getElementById(`cost-${index}`).value),
        date: formatDateForSaving(
          document.getElementById(`date-${index}`).value
        ),
      };

      const updatedItems = [...items];
      updatedItems[index] = updatedItem;
      setItems(updatedItems);

      await editStorage(
        updatedItem.tp_id,
        updatedItem.item,
        updatedItem.cost,
        null,
        updatedItem.quantity,
        null,
        updatedItem.date,
        null
      );

      await deleteInvoice(updatedItem.dnh_id);
      window.location.reload();
    } catch (error) {
      console.error("Error transferring item:", error);
    }
  };

  const addNewItem = () => {
    setItems([...items, { item: "", quantity: 0, cost: 0, date: new Date() }]);
  };

  const calculateTotalCost = (quantity, cost) => {
    return quantity * cost;
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

  const isDateInPast = (dateString) => {
    const currentDate = new Date();
    const selectedDate = new Date(dateString);
    return selectedDate < currentDate;
  };

  const rowClass = (index) => {
    return isDateInPast(items[index].date) ? "red-highlight" : "";
  };

  const [sortedIndices, setSortedIndices] = useState([]);

  useEffect(() => {
    const sorted = items
      .map((item, index) => ({ index, item })) // Attach item object with its index
      .sort((a, b) => new Date(a.item.date) - new Date(b.item.date))
      .map((item) => item.index);

    setSortedIndices(sorted);
  }, [items]);

  return (
    <div className="invoice">
      <h2>Danh sách Hàng Nhập</h2>
      <table>
        <thead>
          <tr>
            <th>dnh_id</th>
            <th>tp_id</th>
            <th>Tên Hàng Hóa</th>
            <th>Đơn Giá</th>
            <th>Số lượng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Edit</th>
            <th>Save</th>
            <th>Nhập kho</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className={rowClass(index)}>
              <td
                id={`dnh_id-${index}`}
                contentEditable={editingRowIndex === index}
              >
                {item.dnh_id}
              </td>
              <td
                id={`tp_id-${index}`}
                contentEditable={editingRowIndex === index}
              >
                {item.tp_id}
              </td>
              <td
                id={`item-${index}`}
                contentEditable={editingRowIndex === index}
              >
                {item.item}
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
                  id={`date-${index}`}
                  type="text"
                  defaultValue={formatDateString(item.date)}
                  readOnly={editingRowIndex !== index}
                  placeholder="dd/mm/yyyy"
                />
              </td>

              <td>{calculateTotalCost(item.quantity, item.cost)}</td>
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
                <Button cell_button onClick={() => handleTransferItem(index)}>
                  Nhập kho
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button cell_button onClick={addNewItem}>
        Add item
      </Button>
    </div>
  );
}

export default Invoice;
