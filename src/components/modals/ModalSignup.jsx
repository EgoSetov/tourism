"react-router-dom";

import { useState } from "react";
import { Button, Modal, Form, Row, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/slices/modalsSlice";
import { asyncSignup } from "../../store/slices/userSlice";

const ModalSignup = () => {
  const dispatch = useDispatch();

  const {
    signup: { visible: show },
  } = useSelector((state) => state.modals);

  const [state, setState] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    avatar: "",
  });

  const changeState = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const changeAvatar = (file) => {
    if (file === null) {
      setState((prev) => ({
        ...prev,
        avatar: null,
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      avatar: file.target.files[0],
    }));
  };

  const onHide = () => {
    dispatch(showModal({ modal: "signup", visible: false }));
  };

  const loginAccouunt = () => {
    dispatch(showModal({ modal: "signup", visible: false }));
    dispatch(showModal({ modal: "signin", visible: true }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!state.email || !state.password || !state.name || !state.surname) return;

    const formData = new FormData();

    formData.append("name", state.name);
    formData.append("surname", state.surname);
    formData.append("email", state.email);
    formData.append("password", state.password);

    if (state.avatar) formData.append("avatar", state.avatar);

    const resSignup = await dispatch(asyncSignup(formData));

    if (resSignup.error) return;

    dispatch(showModal({ modal: "signup", visible: false }));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Регистрация</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Row className="mb-3">
            <Form.Label>Автарка:</Form.Label>
            <Form.Control onChange={changeAvatar} type="file" />
          </Row>

          <Row className="mb-3">
            <Form.Label>Имя:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Дмитрий"
              name="name"
              value={state.name}
              onChange={changeState}
            />
          </Row>
          <Row className="mb-3">
            <Form.Label>Фамилия:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Петров"
              name="surname"
              value={state.surname}
              onChange={changeState}
            />
          </Row>

          <Row className="mb-3">
            <Form.Label>Почта:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="example@mail.ru"
              name="email"
              value={state.email}
              onChange={changeState}
            />
          </Row>
          <Row className="mb-3">
            <Form.Label>Пароль:</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="password"
              name="password"
              value={state.password}
              onChange={changeState}
            />
          </Row>
          <div>
            <Button variant="secondary" onClick={onHide}>
              Закрыть
            </Button>{" "}
            <Button type="submit" variant="primary">
              Зарегистрироваться
            </Button>
            <Button onClick={loginAccouunt} variant="link">
              У вас есть аккаунта? Войти
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSignup;
