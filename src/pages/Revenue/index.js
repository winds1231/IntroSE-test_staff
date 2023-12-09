import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
function Revenue() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else if (token !== "admin") {
      navigate("/");
    }
  });
  const [proceeds, setProceeds] = useState([
    {
      content: "Tiền nước",
      value: 2000,
    },
    {
      content: "Tiền đồ ăn",
      value: 8000,
    },
    {
      content: "Tiền thức ăn vặt",
      value: 2000,
    },
  ]);

  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const contentRefs = useRef([]);
  const valueRefs = useRef([]);

  const handleEditItem = (index) => {
    if (editingRowIndex !== null) return;

    setEditingRowIndex(index);

    const item = proceeds[index];
    contentRefs.current[index].innerText = item.content;
    valueRefs.current[index].innerText = item.value;
  };

  const handleSaveProceed = (index) => {
    const updatedProceed = {
      content: contentRefs.current[index].innerText || "",
      value: parseInt(valueRefs.current[index].innerText, 10) || 0,
    };

    setProceeds((prevProceed) => {
      const newProceed = [...prevProceed];
      newProceed[index] = updatedProceed;
      return newProceed;
    });

    setEditingRowIndex(null);
  };

  const addNewProceed = () => {
    setProceeds([...proceeds, { content: "", value: 0 }]);
  };

  const [expenses, setExpenses] = useState([
    {
      content: "Mặt bằng",
      value: 2000,
    },
    {
      content: "Nhân viên",
      value: 2000,
    },
    {
      content: "Nhập hàng",
      value: 4000,
    },
  ]);

  const [editingRowIndex_Expense, setEditingRowIndex_Expense] = useState(null);
  const contentRefs_Expense = useRef([]);
  const valueRefs_Expense = useRef([]);

  const handleEditItem_Expense = (index) => {
    if (editingRowIndex_Expense !== null) return;

    setEditingRowIndex_Expense(index);

    const item = expenses[index];
    contentRefs_Expense.current[index].innerText = item.content;
    valueRefs_Expense.current[index].innerText = item.value;
  };

  const handleSaveExpense = (index) => {
    const updatedExpense = {
      content: contentRefs_Expense.current[index].innerText || "",
      value: parseInt(valueRefs_Expense.current[index].innerText, 10) || 0,
    };

    setExpenses((prevExpense) => {
      const newExpense = [...prevExpense];
      newExpense[index] = updatedExpense;
      return newExpense;
    });

    setEditingRowIndex_Expense(null);
  };

  const addNewExpense = () => {
    setExpenses([...expenses, { content: "", value: 0 }]);
  };
  const [revenueCalc, setRevenueCalc] = useState(0);

  useEffect(() => {
    const revenue =
      proceeds.reduce((total, item) => total + item.value, 0) -
      expenses.reduce((total, item) => total + item.value, 0);
    setRevenueCalc(revenue);
  }, [proceeds, expenses]);

  return (
    <div className="revenue">
      <h2>Thu nhập</h2>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Nội dung</th>
            <th>Số tiền</th>
            <th>Edit</th>
            <th>Save</th>
          </tr>
        </thead>
        <tbody>
          {proceeds.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td
                ref={(el) => (contentRefs.current[index] = el)}
                contentEditable={editingRowIndex === index}
                suppressContentEditableWarning
              >
                {item.content}
              </td>
              <td
                ref={(el) => (valueRefs.current[index] = el)}
                contentEditable={editingRowIndex === index}
                suppressContentEditableWarning
              >
                {item.value}
              </td>
              <td>
                <button
                  onClick={() => handleEditItem(index)}
                  disabled={editingRowIndex !== null}
                >
                  Edit
                </button>
              </td>
              <td>
                {editingRowIndex === index && (
                  <button onClick={() => handleSaveProceed(index)}>Save</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addNewProceed}>Add proceed</button>

      <h2>Chi tiêu</h2>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Nội dung</th>
            <th>Số tiền</th>
            <th>Edit</th>
            <th>Save</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td
                ref={(el) => (contentRefs_Expense.current[index] = el)}
                contentEditable={editingRowIndex_Expense === index}
                suppressContentEditableWarning
              >
                {item.content}
              </td>
              <td
                ref={(el) => (valueRefs_Expense.current[index] = el)}
                contentEditable={editingRowIndex_Expense === index}
                suppressContentEditableWarning
              >
                {item.value}
              </td>
              <td>
                <button
                  onClick={() => handleEditItem_Expense(index)}
                  disabled={editingRowIndex_Expense !== null}
                >
                  Edit
                </button>
              </td>
              <td>
                {editingRowIndex_Expense === index && (
                  <button onClick={() => handleSaveExpense(index)}>Save</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addNewExpense}>Add expense</button>
      <h2>Doanh thu:</h2>
      <td>{revenueCalc}</td>
    </div>
  );
}

export default Revenue;
