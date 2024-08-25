import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./PageNav.module.css";
import { useAuth } from "../contexts/AuthContext";
function PageNav() {
  const { user, logout } = useAuth();
  function handleClick() {
    logout();
    localStorage.removeItem("worldwiseid");
  }
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/pricing">pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        {user?.email ? (
          <>
            <li>
              <NavLink onClick={handleClick} to="/" className={styles.ctaLink}>
                Logout
              </NavLink>
            </li>
            <li>
              <NavLink to="/app" className={styles.ctaLink}>
                App
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className={styles.ctaLink}>
                login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className={styles.ctaLink}>
                sign up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default PageNav;
