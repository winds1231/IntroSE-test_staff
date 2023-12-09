/* eslint-disable no-template-curly-in-string */
import Tippy from "@tippyjs/react/headless";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import SearchItems from "~/components/SearchItems";
import styles from "./Search.module.scss";
import classNames from "classnames/bind";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDebounce } from "~/hooks";
import {
  faCircleXmark,
  faSpinner,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);
function Search() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showResult, setShowResult] = useState(true);
  const [loading, setLoading] = useState(false);

  const debounced = useDebounce(searchValue, 500);

  const searchRef = useRef();
  useEffect(() => {
    if (!debounced.trim()) {
      setSearchResult([]);
      return;
    }

    setLoading(true);

    fetch(
      `https://tiktok.fullstack.edu.vn/api/users/search?q=${encodeURIComponent(
        debounced
      )}&type=less`
    )
      .then((res) => res.json())
      .then((res) => {
        setSearchResult(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]); // []: chạy 1 lần duy nhất khi component được render lần đầu tiên

  const handleClear = () => () => {
    setSearchValue("");
    setSearchResult([]);
    searchRef.current.focus();
  };

  const handleHideSearchResult = () => {
    setShowResult(false);
  };

  return (
    <Tippy
      interactive={true}
      visible={showResult && searchResult.length > 0}
      render={(attrs) => (
        <div className={cx("search-suggestion")} tabIndex={"-1"} {...attrs}>
          <PopperWrapper>
            <h4 className={cx("title")}>Sản phẩm tìm kiếm</h4>
            {searchResult.map((result) => (
              <SearchItems key={result.id} data={result} />
            ))}
          </PopperWrapper>
        </div>
      )}
      onClickOutside={handleHideSearchResult}
    >
      <div className={cx("search")}>
        <input
          ref={searchRef}
          value={searchValue}
          placeholder="Tìm kiếm sản phẩm"
          spellCheck={false}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowResult(true)}
        />
        {!!searchValue && !loading && (
          <button className={cx("btn-clear")} onClick={handleClear()}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}
        {loading && (
          <FontAwesomeIcon className={cx("loading")} icon={faSpinner} />
        )}
        {/*Loading*/}

        <button className={cx("btn-search")}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </Tippy>
  );
}

export default Search;
