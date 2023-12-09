import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import styles from "./Button.module.scss";
const cx = classNames.bind(styles);
function Button({
  to,
  href,
  primary = false,
  outline = false,
  small = false,
  large = false,
  text = false,
  disabled = false,
  rounded = false,
  cell_button = false,
  leftIcon,
  rightIcon,
  onClick,
  children,
  classNames,
  ...passProps
}) {
  let Comp = "button";
  const props = {
    onClick,
    ...passProps,
  };

  if (disabled) {
    delete props.onClick;
  }

  if (to) {
    props.to = to;
    Comp = Link;
  } else if (href) {
    props.href = href;
    Comp = "a";
  }
  const className = cx("wrapper", {
    primary,
    outline,
    small,
    large,
    text,
    disabled,
    rounded,
    cell_button,
    [classNames]: classNames,
  });
  return (
    <Comp className={className} {...props}>
      {leftIcon && <span className={cx("icon")}>{leftIcon}</span>}
      <span className={cx("title")}>{children}</span>
      {rightIcon && <span className={cx("icon")}>{rightIcon}</span>}
    </Comp>
  );
}

export default Button;
