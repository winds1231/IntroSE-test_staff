import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import images from "~/assets/images";
// import Search from "./Search";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "~/components/Button";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";
const cx = classNames.bind(styles);
function Header() {
  const currentUser = localStorage.getItem("token");
  console.log(currentUser);

  function handleLogout() {
    localStorage.removeItem("token");
  }
  return (
    <header className={cx("wrapper")}>
      <div className={cx("inner")}>
        <div className={cx("logo")}>
          <img src={images.logo.default} alt="logo" />
        </div>
        {/* <Search /> */}

        <div className={cx("action")}>
          {currentUser ? (
            <Fragment>
              <Button text to="/sale">
                Bán hàng
              </Button>
              <Button text to="/storage">
                Kho
              </Button>
              <Button text to="/revenue">Doanh thu</Button>
              <Button text to ="/staff">Nhân viên</Button>
              <Button primary onClick={() => handleLogout()} to="/login">
                Đăng xuất
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <Button
                primary
                leftIcon={<FontAwesomeIcon icon={faSignIn} />}
                to="/login"
              >
                Đăng nhập
              </Button>
              {/* <Button text>Đăng ký</Button> */}
            </Fragment>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
