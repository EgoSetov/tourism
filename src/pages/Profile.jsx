import { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row, Form, ListGroup, Badge, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { showModal } from "../store/slices/modalsSlice";
import { asyncDeleteUser, asyncGetUsers, asyncUpdateUser } from "../store/slices/userSlice";
import { getFullPath } from "../utils/getFullPath";
import noPhoto from "../assets/images/noPhoto.jpg";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);

  const [avatar, setAvatar] = useState(null);

  const [state, setState] = useState({
    name: "",
    surname: "",
    email: "",
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
    const newAvatar = URL.createObjectURL(file.target.files[0]);
    setAvatar(newAvatar);

    setState((prev) => ({
      ...prev,
      avatar: file.target.files[0],
    }));
  };

  const getAvatar = () => {
    if (avatar) {
      if (avatar.includes("blob")) {
        return avatar;
      } else {
        return getFullPath({ uploads: avatar });
      }
    }
    return noPhoto;
  };

  const isAdminPanel = () => {
    if (location.pathname === "/profile/admin") return true;
  };

  const getAdminPanel = () => {
    if (isAdminPanel()) {
      navigate("/profile");
    } else if (location.pathname === "/profile") {
      navigate("/profile/admin");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!state.email || !state.name || !state.surname) return;

    const formData = new FormData();

    formData.append("name", state.name);
    formData.append("surname", state.surname);
    formData.append("email", state.email);

    if (avatar) {
      formData.append("avatar", state.avatar);
    } else {
      formData.append("avatar", "delete");
    }

    setLoading(true);
    const resUpdate = await dispatch(
      asyncUpdateUser({
        data: formData,
        userId: user.id,
      })
    );
    setLoading(false);

    if (resUpdate.error) return;
  };

  useEffect(() => {
    if (user) {
      setState(user);
      setAvatar(user.avatar);
    }
  }, [user]);

  useEffect(() => {
    if (location.pathname === "/profile/admin") {
      if (user && user.type !== "admin") {
        navigate("/profile");
      }
    }
  }, [user]);

  return (
    <Container className="pt-5">
      {!!user && user.type === "admin" && (
        <>
          {isAdminPanel() ? (
            <Button onClick={getAdminPanel} className="mb-3" variant="success">
              <i class="bi bi-arrow-bar-left"></i> <span>Мой профиль</span>
            </Button>
          ) : (
            <Button onClick={getAdminPanel} className="mb-3" variant="success">
              <span>Перейти в панель администратора</span>
            </Button>
          )}
        </>
      )}
      {user && (
        <>
          {isAdminPanel() ? (
            <UserList />
          ) : (
            <Form onSubmit={onSubmit} className="profile">
              <Col xs={4} md={2}>
                <Image width={300} src={getAvatar()} rounded />
              </Col>
              <Button onClick={() => setAvatar(null)} className="mt-3" variant="danger">
                Удалить аватар
              </Button>
              <div className="pt-3">
                <Row className="mb-3">
                  <Form.Label>Аватар:</Form.Label>
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

                <div className="py-3">
                  <Row>
                    <Button disabled={loading} type="submit" variant="success">
                      Сохранить
                    </Button>
                  </Row>
                </div>
              </div>
            </Form>
          )}
        </>
      )}
    </Container>
  );
};

const UserList = (props) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [userList, setUserList] = useState([]);

  const getUsers = async () => {
    setLoading(true);
    const resGetUsers = await dispatch(asyncGetUsers());
    setLoading(false);
    if (resGetUsers.error) return;

    setUserList(resGetUsers.payload.users);
  };

  const deleteUser = async (id) => {
    const resDeleteUser = await dispatch(asyncDeleteUser(id));
    if (resDeleteUser.error) return;

    getUsers();
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="admin-panel">
      <h2>Пользователей {userList.length}</h2>
      {loading && (
        <div className="d-flex justify-content-center mb-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      )}
      <ListGroup as="ol" numbered>
        {userList.map((user, index) => (
          <ListGroup.Item key={user.id} as="li" className="d-flex justify-content-between align-items-center">
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                {user.surname} {user.name}
              </div>
              {user.email}
            </div>
            <Button onClick={() => deleteUser(user.id)} variant="danger">
              Удалить
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Profile;
