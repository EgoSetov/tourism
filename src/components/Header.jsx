import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../other/images/logo.png";
import { showModal } from "../store/slices/modalsSlice";
import { signout } from "../store/slices/userSlice";

const Header = () => {
  const dispatch = useDispatch();

  const { user, isAuth } = useSelector((state) => state.user);

  const onSignup = () => {
    dispatch(showModal({ modal: "signin", visible: true }));
  };

  const onSignout = () => {
    dispatch(signout({ modal: "signin", visible: true }));
  };

  const links = [
    {
      to: "/regions",
      title: "Регионы",
    },
    {
      to: "/payment",
      title: "Оплата",
    },
    // {
    //   to: "/contacts",
    //   title: "Контакты",
    // },
    {
      to: "/reviews",
      title: "Вопрос&Ответ",
    },
    {
      to: "/news",
      title: "Новости",
    },
  ];

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <img src={Logo} alt="logo" />{" "}
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Многодневные туры
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {links.map((link) => (
              <Nav.Link key={link.to}>
                <Link style={{ color: "grey", textDecoration: "none" }} to={link.to}>
                  {link.title}
                </Link>
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
        {isAuth ? (
          <Navbar.Collapse className="justify-content-end gap-3">
            <Navbar.Text>
              Авторизован, как:{" "}
              <Link to="profile">
                {user.surname} {user.name}
              </Link>
            </Navbar.Text>
            <Button onClick={onSignout} variant="danger">
              Выйти
            </Button>
          </Navbar.Collapse>
        ) : (
          <Button onClick={onSignup} variant="primary">
            Войти
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
