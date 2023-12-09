// import Search from "~/components/Layout/components/Header/Search";
import classNames from "classnames/bind";
import styles from "./Sale.module.scss";
import { useState, useRef, useEffect } from "react";
import Button from "~/components/Button";
import { getStorage } from "~/services/getStorageService";
import { editStorage } from "~/services/editStorageService";
import { createBill } from "~/services/createBill";
import { createBillInfo } from "~/services/createBillInfo";
const cx = classNames.bind(styles);
function Storage() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user", user);
  const [items, setItems] = useState([]);

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

  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const itemRefs = useRef([]);
  const quantityRefs = useRef([]);
  const priceRefs = useRef([]);
  const [orderItems, setOrderItems] = useState([]);

  const [customerPayment, setCustomerPayment] = useState(0);
  const handleInputChange = (e) => {
    setCustomerPayment(e.target.value);
  };
  const handleDeleteItem = (itemToDelete) => {
    setOrderItems(orderItems.filter((item) => item.name !== itemToDelete.name));
  };

  function isZero(item) {
    if (item.quantity === 0) {
      handleDeleteItem(item);
      return;
    } else return item.quantity;
  }

  let handleCreateBill = async (nv_id, tongtien) => {
    let ngaylap = new Date().toISOString().slice(0, 10);
    try {
      let data = await createBill(nv_id, ngaylap, tongtien);
      let hd_id = parseInt(data.message.newBill);
      return hd_id;
    } catch (error) {
      console.error("Error occurred:", error);

      if (error.response && error.response.data) {
        console.error("Error response data:", error.response.data);
      }

      throw error;
    }
  };

  let handleCreateBillInfo = async (hd_id, tp_id, quantity, price) => {
    try {
      // console.log("Info ", hd_id, tp_id, quantity, price);
      await createBillInfo(hd_id, tp_id, quantity, price);
    } catch (error) {
      console.error("Error occurred:", error);

      if (error.response && error.response.data) {
        console.error("Error response data:", error.response.data);
      }

      throw error;
    }
  };

  const handlePayment = async () => {
    let newItems = [...items];
    for (let orderItem of orderItems) {
      let item = newItems.find((item) => item.item === orderItem.name);

      // Nếu tìm thấy mặt hàng, giảm số lượng tồn
      if (item) {
        item.quantity -= orderItem.quantity;
      }
      try {
        const updatedItem = {
          ...item,
          tp_id: item.tp_id,
          item: item.item,
          cost: item.cost,
          price: item.price,
          quantity: item.quantity,
          hsd: item.hsd,
        };

        const updatedItems = [...items];
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
    }
    setItems(newItems);
    setOrderItems([]);
    setCustomerPayment(0);
  };

  const handleQuantityChange = (event, index) => {
    let newQuantity = parseInt(event.target.value);
    if (newQuantity > items[index].quantity) {
      newQuantity = items[index].quantity;
    }
    // Cập nhật số lượng của mặt hàng
    setOrderItems(
      orderItems.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleSaveItem = async (event, index) => {
    try {
      let newQuantity = parseInt(event.target.value);
      if (newQuantity > items[index].quantity) {
        newQuantity = items[index].quantity;
      }
      const updatedItem = {
        ...items[index],
        tp_id: items[index].tp_id,
        item: items[index].item,
        cost: items[index].cost,
        price: items[index].price,
        quantity: items[index].quantity - newQuantity,
        hsd: items[index].hsd,
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

  const addNewOrderItem = (item) => {
    const isExist = orderItems.find(
      (orderItem) => orderItem.name === item.item
    );
    if (isExist) {
      // Do nothing
    } else {
      console.log(item);
      setOrderItems([
        ...orderItems,
        { id: item.tp_id, name: item.item, price: item.price, quantity: 1 },
      ]);
    }
  };
  const total = orderItems.reduce(
    (total, orderItem) => total + orderItem.quantity * orderItem.price,
    0
  );
  return (
    <div className={cx("order")}>
      <div className={cx("bill")}>
        <h2 className={cx("title")}>Hóa đơn</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên hàng hóa</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thành tiền</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>
                  <input
                    className="quantity"
                    type="number"
                    value={isZero(item)}
                    onChange={(event) => {
                      handleQuantityChange(event, index);
                    }}
                  />
                </td>
                <td>{item.price}</td>
                <td>{item.quantity * item.price}</td>
                <td>
                  <Button primary onClick={() => handleDeleteItem(item)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <input
          className={cx("customerPayment")}
          type="text"
          placeholder="Nhập tiền khách hàng gửi"
          value={customerPayment}
          onChange={handleInputChange}
        />
        <h2 className={cx("total")}>Tổng tiền: {total}</h2>
        <h2 className={cx("total")}>Tiền thối: {customerPayment - total}</h2>
        <Button
          primary
          onClick={() => {
            handleCreateBill(user.nv_id, total).then((hd_id) => {
              for (let orderItem of orderItems) {
                let tp_id = parseInt(orderItem.id);
                let quantity = parseInt(orderItem.quantity);
                let price = parseInt(orderItem.price);
                console.log(hd_id, tp_id, quantity, price);
                handleCreateBillInfo(hd_id, tp_id, quantity, price);
              }
            });
            handlePayment();
          }}
        >
          Thanh toán
        </Button>
      </div>
      <div className={cx("items")}>
        <h2 className={cx("title")}>Kho</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên Hàng Hóa</th>
              <th>Giá bán</th>
              <th>Số lượng tồn</th>
              <th>Thêm vào hóa đơn</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td
                  ref={(el) => (itemRefs.current[index] = el)}
                  contentEditable={editingRowIndex === index}
                  suppressContentEditableWarning
                >
                  {item.item}
                </td>
                <td
                  ref={(el) => (priceRefs.current[index] = el)}
                  contentEditable={editingRowIndex === index}
                  suppressContentEditableWarning
                >
                  {item.price}
                </td>
                <td
                  ref={(el) => (quantityRefs.current[index] = el)}
                  contentEditable={editingRowIndex === index}
                  suppressContentEditableWarning
                >
                  {item.quantity}
                </td>
                <td>
                  <Button
                    primary
                    onClick={() => addNewOrderItem(item)}
                    disabled={item.quantity <= 0}
                  >
                    Thêm
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Storage;
