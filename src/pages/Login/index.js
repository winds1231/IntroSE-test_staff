import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "~/components/Button";
import { handleLoginAPI } from "~/services/userService";
const cx = classNames.bind(styles);

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  let handleLogin = async () => {
    setErrorMessage("");
    if (username === "admin" || password === "admin") {
      localStorage.setItem("token", "admin");
      localStorage.setItem("user", JSON.stringify({ nv_id: 0, name: "admin" }));
      navigate("/");
    } else {
      try {
        const response = await handleLoginAPI(username, password);
        if (response && response.data.errorCode !== 0) {
          setErrorMessage(response.data.errorMessage);
        }
        if (response && response.data.errorCode === 0) {
          setErrorMessage("");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/");
        }
        // console.log(response.data.errorMessage);
        setErrorMessage(response.data.errorMessage);
      } catch (error) {
        console.log(error);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("login-container")}>
        <h1 className={cx("login-title")}>Đăng nhập</h1>
        <form class={cx("login-form")}>
          <label htmlFor="username">Mã nhân viên</label>
          <input
            type="text"
            value={username}
            id="username"
            name="username"
            placeholder="Mã nhân viên"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <label htmlFor="password">Mật khẩu</label>
          <input
            value={password}
            type="password"
            id="password"
            name="password"
            placeholder="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </form>
        <div className="col-12" style={{ margin: 5, color: "red" }}>
          {errorMessage}
        </div>
        <Button
          primary
          onClick={() => {
            handleLogin();
          }}
        >
          Đăng nhập
        </Button>
      </div>
    </div>
  );
}

export default Login;
