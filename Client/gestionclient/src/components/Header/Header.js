import { useContext, useEffect, useState } from "react";
import { Context } from "../../ContextStore";
import {
  Navbar,
  Nav
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import "primeicons/primeicons.css";
import "./Header.css";



function Header() {
  const {  setUserData } = useContext(Context);
  const [isAuth] = useState(sessionStorage.getItem('isAuth') === 'true');

  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  useEffect(
  () => {

}
,[])

 
  //console.log(userData);
  return (
    <Navbar className="navbar" collapseOnSelect bg="light" variant="light">
      <div className="container">
     
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {/* <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link> */}
          </Nav>
          {isAuth  ? (
            <Nav>
              <div className="menu-icon" onClick={handleClick}>
                <i
                  className={click ? "pi pi-fw pi-times" : "pi pi-fw pi-bars"}
                />
              </div>

              <ul className={click ? "nav-menu active" : "nav-menu"}>
                <li className="nav-item">
                  <Link className="nav-links" onClick={closeMobileMenu} to="/">
                    <i className="pi pi-fw pi-home"></i>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-links"
                    to="/auth/logout"
                    onClick={() => {
                      closeMobileMenu();
                      setUserData(null);
                      sessionStorage.removeItem('isAuth');
                      sessionStorage.removeItem('token');
                      window.location.reload(false);
                    }}
                  >
                    <IoLogOut />
                    Log out
                  </Link>
                </li>
                {/* Begin Notification Section */}
              </ul>
              {/* END Notification Section */}
            </Nav>
          ) : (
            <Nav>
              <div className="menu-icon" onClick={handleClick}>
                <i
                  className={click ? "pi pi-fw pi-times" : "pi pi-fw pi-bars"}
                />
              </div>
              <ul className={click ? "nav-menu active" : "nav-menu"}>
                <li className="nav-item">
                  <Link className="nav-links" onClick={closeMobileMenu} to="/">
                    <i className="pi pi-fw pi-home"></i>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-links"
                    id="nav-sign-in"
                    onClick={closeMobileMenu}
                    to="/auth/login"
                  >
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-links"
                    onClick={closeMobileMenu}
                    to="/auth/register"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
              {/*              {button && <Button buttonStyle='btn--outline'>Sign In</Button>}  */}
              {/*   <NavLink className="nav-item" id="nav-sign-up" to="/"><i class="pi pi-fw pi-home"></i>
                                Home
                            </NavLink>
                            <NavLink className="nav-item" id="nav-sign-up" to="/">
                                Marketplace
                            </NavLink>
                            <NavLink className="nav-item" id="nav-sign-in" to="/auth/login">
                                Sign In
                            </NavLink>
                            <NavLink className="nav-item" id="nav-sign-up" to="/auth/register">
                                Sign Up
                            </NavLink> */}
            </Nav>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;
