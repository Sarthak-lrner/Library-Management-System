import { NavLink, useHistory } from "react-router-dom";
import { useAuth } from "../../Auth/AuthProvider";
import authService from "../../Api/authService";






export const Navbar = () => {
  const history = useHistory();
  const { isLoggedIn, logout } = useAuth();
  const claims = authService.getUserClaims();


  const handleLogout = () => {
    logout(); // Calls AuthProvider's logout method
    history.push("/home");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">Love To Read</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">
                Search Books
              </NavLink>
            </li>
            {isLoggedIn && <li className="nav-item">
              <NavLink className="nav-link" to="/shelf">Shelf</NavLink>
            </li>} 
            {isLoggedIn && claims?.role=="ADMIN" &&<li className="nav-item">
              <NavLink className="nav-link" to="/admin">Admin</NavLink>
            </li>} 
            {isLoggedIn &&<li className="nav-item">
              <NavLink className="nav-link" to="/fees">Pay fees</NavLink>
            </li>} 

          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item m-1">
              {isLoggedIn ? (
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <NavLink className="btn btn-outline-light" to="/login">
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
