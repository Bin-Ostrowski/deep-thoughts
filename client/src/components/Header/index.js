import React from "react";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";

const Header = () => {
  // logout
  // event.preventDefault() overrides the <a> element's default nature of browser load
  // a different resource. Instead, execute .logout() method, which removes token from
  // localStorage and refreshs by taking the user back to the homepage. See logout in Auth
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>Deep Thoughts</h1>
        </Link>
        <nav className="text=center">
          {/* if logged in show Me and Logout, else show login and singup */}
          {Auth.loggedIn() ? (
            <>
              <Link to="/profile">Me</Link>
              {/* on click run logout function */}
              <a href="/" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
