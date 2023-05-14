"react-router-dom";

import { useState } from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { showModal } from "../../store/slices/modalsSlice";
import { asyncCreateQuestion, asyncGetQuestions, asyncUpdateQuestion } from "../../store/slices/questionsSlice";

const ModalCreateQuestion = ({ mode }) => {
  const dispatch = useDispatch();

  const { isAuth, user } = useSelector((state) => state.user);
  const modals = useSelector((state) => state.modals);

  const modalData = mode === "edit" ? modals.editQuestion.data : modals.createQuestion.data;

  const show = mode === "edit" ? modals.editQuestion.visible : modals.createQuestion.visible;

  const modalName = mode === "edit" ? "editQuestion" : "createQuestion";

  const [state, setState] = useState({
    title: modalData?.title || "",
    description: modalData?.description || "",
    answer: modalData?.answer || "",
    status: modalData?.status || "pending",
  });

  const changeState = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onHide = () => {
    dispatch(showModal({ modal: modalName, visible: false }));
  };

  const changeStatus = (value) => {
    setState((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!state.title || !state.status) return;

    const data = {
      title: state.title,
      description: state.description,
      answer: state.answer,
      status: state.status,
    };

    if (!state.answer) data.status = "pending";
    else data.status = "done";

    let res = null;

    if (mode === "edit") {
      res = await dispatch(asyncUpdateQuestion({ questionId: modalData.id, data }));
    } else {
      res = await dispatch(asyncCreateQuestion(data));
    }

    if (res.error) return;

    await dispatch(asyncGetQuestions());

    dispatch(showModal({ modal: modalName, visible: false }));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>{mode === "edit" ? "Редактровать" : "Задать"} вопрос</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Row className="mb-3">
            <Form.Label>Тема:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Тема вопроса"
              name="title"
              value={state.title}
              onChange={changeState}
            />
          </Row>
          <Row className="mb-3">
            <Form.Label>Описание вопроса:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Описание вопроса"
              name="description"
              value={state.description}
              onChange={changeState}
            />
          </Row>
          {isAuth && user?.type === "admin" && (
            <Row className="mb-3">
              <Form.Label>Ответ:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Описание вопроса"
                name="answer"
                value={state.answer}
                onChange={changeState}
              />
            </Row>
          )}
          {isAuth && user?.type === "admin" && (
            <Row className="mb-3">
              <Form.Label>Статус:</Form.Label>
              <Form.Select
                onChange={({ target: { value } }) => changeStatus(value)}
                value={state.status}
                className="mb-2"
              >
                <option value="pending">pending</option>
                <option value="done">done</option>
              </Form.Select>
            </Row>
          )}

          <div className="py-3">
            <Button variant="secondary" onClick={onHide}>
              Закрыть
            </Button>{" "}
            <Button type="submit" variant="primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateQuestion;
