import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../store/slices/modalsSlice";
import { asyncDeleteQuestion, asyncGetQuestions } from "../store/slices/questionsSlice";

const Reviews = () => {
  const dispatch = useDispatch();
  const { questions } = useSelector((state) => state.questions);
  const { isAuth, user } = useSelector((state) => state.user);

  const [loading, setloading] = useState(false);

  const getQuestions = async () => {
    setloading(true);
    await dispatch(asyncGetQuestions());
    setloading(false);
  };

  const editQuestion = (data) => dispatch(showModal({ modal: "editQuestion", visible: true, data }));

  const deleteQuestion = async (id) => {
    await dispatch(asyncDeleteQuestion(id));
    getQuestions();
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <>
      <div className="d-flex align-items-center gap-3">
        <h1>Ваши вопросы</h1>
        {isAuth && (
          <Button
            onClick={() => {
              dispatch(showModal({ modal: "createQuestion", visible: true }));
            }}
            variant="success"
          >
            Задать
          </Button>
        )}
      </div>
      <hr />
      {loading && <Spinner />}
      <div className="d-flex flex-column gap-2">
        {questions.map((question) => (
          <Card key={question.id}>
            <Card.Header className="d-flex justify-content-between">
              <span>
                Автор: {question.creator?.surname} {question.creator?.name}
              </span>
              <span>
                Статус:{" "}
                {question.status === "pending" ? (
                  <span className="text-secondary">Ожидает ответа</span>
                ) : (
                  <span className="text-success">Отвечен</span>
                )}
              </span>
            </Card.Header>
            <Card.Body>
              <Card.Title>Тема: {question.title}</Card.Title>
              {question.description && <Card.Text>Описание: {question.description}</Card.Text>}
              {question.answer && <Card.Text>Ответ: {question.answer}</Card.Text>}
              <div className="d-flex gap-2">
                {isAuth && user?.type === "admin" && (
                  <Button onClick={() => editQuestion(question)} variant="primary">
                    {question.answer ? "Изменить" : "Дать"} ответ
                  </Button>
                )}
                {isAuth && (user?.type === "admin" || user.id === question.creator?.id) && (
                  <Button onClick={() => deleteQuestion(question.id)} variant="danger">
                    Удалить
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Reviews;
