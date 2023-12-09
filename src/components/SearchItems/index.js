import classNames from "classnames/bind";
import styles from "./SearchItems.module.scss";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);
function SearchItems({ data }) {
  return (
    <Link to={`/@${data.nickname}`} className={cx("wrapper")}>
      <div className={cx("info")}>
        <h4 className={cx("name")}>{data.full_name}</h4>
        <span className={cx("price")}>{data.nickname}</span>
      </div>
    </Link>
  );
}

export default SearchItems;
