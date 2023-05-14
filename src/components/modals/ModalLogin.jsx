import { useState } from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/slices/modalsSlice";
import { asyncConnect, asyncLogin } from "../../store/slices/userSlice";

const ModalLogin = () => {
  const dispatch = useDispatch();

  const {
    signin: { visible: show },
  } = useSelector((state) => state.modals);

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const changeState = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onHide = () => {
    dispatch(showModal({ modal: "signin", visible: false }));
  };

  const createAccouunt = () => {
    dispatch(showModal({ modal: "signin", visible: false }));
    dispatch(showModal({ modal: "signup", visible: true }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!state.email || !state.password) return;

    const resSignin = await dispatch(
      asyncLogin({
        email: state.email,
        password: state.password,
      })
    );

    if (resSignin.error) return;

    const token = resSignin.payload.token;

    dispatch(asyncConnect(token));

    dispatch(showModal({ modal: "signin", visible: false }));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Авторизация</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
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
              Войти
            </Button>
            <Button onClick={createAccouunt} variant="link">
              Хотите создать аккаунт?
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalLogin;
