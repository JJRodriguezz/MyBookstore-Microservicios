import React, { useContext } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { itemCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName =
    user?.name ||
    user?.username ||
    (user?.email ? user.email.split("@")[0] : "");

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>MyBookStore</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!user ? (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>Iniciar sesión</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>Registrarse</Nav.Link>
                  </LinkContainer>
                </>
              ) : (
                <>
                  <NavDropdown title={displayName || "Mi cuenta"} id="user-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Mi perfil</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orders">
                      <NavDropdown.Item>Mis pedidos</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={handleLogout}>
                      Cerrar sesión
                    </NavDropdown.Item>
                  </NavDropdown>
                  <LinkContainer to="/cart">
                    <Nav.Link className="d-flex align-items-center">
                      <FaShoppingCart style={{ marginRight: "5px" }} />
                      Carrito
                      {itemCount > 0 && (
                        <span className="badge bg-primary ms-1 rounded-pill">
                          {itemCount}
                        </span>
                      )}
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
              <LinkContainer to="/about">
                <Nav.Link>Acerca de</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
