import { useEffect, useState } from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/slices/modalsSlice";
import { asyncCreateNews, asyncGetNews, asyncUpdateNews } from "../../store/slices/newsSlice";
import { getFullPath } from "../../utils/getFullPath";

const ModalCreateNews = (props) => {
  const {
    mode, // мод модального окна, может быть edit | null
  } = props;

  const dispatch = useDispatch();

  const modals = useSelector((state) => state.modals);

  const modalData = mode === "edit" ? modals.editNews.data : modals.createNews.data;

  const show = mode === "edit" ? modals.editNews.visible : modals.createNews.visible;

  const modalName = mode === "edit" ? "editNews" : "createNews";

  const [photos, setPhotos] = useState([]);

  const [state, setState] = useState({
    title: modalData?.title || "",
    description: modalData?.description || "",
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

  const uploadPhoto = (files) => {
    setPhotos((prev) => [...prev, ...files]);
  };

  const deletePhoto = (photo) => {
    if (typeof photo === "object") {
      setPhotos((prev) => prev.filter((p) => p?.name !== photo.name));
    } else {
      setPhotos((prev) => prev.filter((p) => p !== photo));
    }
  };

  const getPhoto = (photo) => {
    if (typeof photo === "object") {
      const newPhoto = URL.createObjectURL(photo);
      return newPhoto;
    } else {
      if (photo.includes("blob")) {
        return photo;
      } else {
        return getFullPath({ uploads: photo });
      }
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!state.title) return;

    const formData = new FormData();

    formData.append("title", state.title);
    formData.append("description", state.description);

    if (mode === "edit") {
      formData.append("photos", JSON.stringify(photos.filter((p) => typeof p === "string")));
    }

    if (photos.length) {
      JSON.stringify(
        photos
          .filter((p) => typeof p === "object")
          .forEach((photo) => {
            formData.append("photo", photo);
          })
      );
    }

    let res = null;

    if (mode === "edit") {
      res = await dispatch(asyncUpdateNews({ newsId: modalData.id, data: formData }));
    } else {
      res = await dispatch(asyncCreateNews(formData));
    }

    if (res.error) return;

    await dispatch(asyncGetNews({ page: 1 }));

    onHide();
  };

  
  useEffect(() => {
    if (modalData) {
      setPhotos(modalData.photos);
    }
  }, [modalData]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>{mode === "edit" ? "Редактировать" : "Создать"} статью</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Row className="mb-3">
            <Form.Label>Заголовок:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Новость 1"
              name="title"
              value={state.title}
              onChange={changeState}
            />
          </Row>
          <Row className="mb-3">
            <Form.Label>Описание:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Главной новостью будет"
              name="description"
              value={state.description}
              onChange={changeState}
            />
          </Row>
          <div className="photos-list d-flex gap-2 white-space-wrap">
            {photos.map((photo) => (
              <div className="photos-list-item">
                <div style={{ backgroundImage: `url(${getPhoto(photo)})` }} body className="photos-list-item-photo">
                  <div onClick={() => deletePhoto(photo)} className="photos-list-item-delete">
                    <i class="bi bi-trash3"></i>
                  </div>
                </div>
              </div>
            ))}
            <div className="photos-list-item border border-primary">
              <label for="file" className="photos-list-item-photo d-flex align-items-center justify-content-center">
                <span>Загрузить фото</span>
                <input
                  onChange={(file) => {
                    uploadPhoto(file.target.files);
                  }}
                  className="d-none"
                  type="file"
                  id="file"
                />
              </label>
            </div>
          </div>
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

export default ModalCreateNews;
