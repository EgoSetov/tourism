"react-router-dom";

import { useEffect, useState } from "react";
import { Button, Modal, Form, Row, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  asyncCreateHotel,
  asyncGetCitys,
  asyncGetRecommendationCitys,
  asyncUpdateHotel,
} from "../../store/slices/citysSlice";
import { showModal } from "../../store/slices/modalsSlice";
import { getFullPath } from "../../utils/getFullPath";

const ModalCreateHotel = ({ mode }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const modals = useSelector((state) => state.modals);

  const modalData = mode === "edit" ? modals.editHotel.data : modals.createHotel.data;

  const show = mode === "edit" ? modals.editHotel.visible : modals.createHotel.visible;

  const modalName = mode === "edit" ? "editHotel" : "createHotel";

  const [photos, setPhotos] = useState([]);

  const [state, setState] = useState({
    name: modalData?.name || "",
    description: modalData?.description || "",
    rating: modalData?.rating || 0,
    summer: modalData?.price?.summer || 0,
    winter: modalData?.price?.winter || 0,
    other: modalData?.price?.other || 0,
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

  const changeRating = (value) => {
    setState((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!state.name) return;

    const formData = new FormData();

    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("rating", state.rating);
    formData.append(
      "price",
      JSON.stringify({
        summer: state.summer,
        winter: state.winter,
        other: state.other,
      })
    );

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
      res = await dispatch(asyncUpdateHotel({ hotelId: modalData.id, data: formData }));
    } else {
      res = await dispatch(asyncCreateHotel({ cityId: modalData.cityId, data: formData }));
    }

    if (res.error) return;

    if (location.pathname === "/") {
      await dispatch(asyncGetRecommendationCitys());
    } else {
      await dispatch(asyncGetCitys());
    }

    dispatch(showModal({ modal: modalName, visible: false }));
  };

  useEffect(() => {
    if (modalData?.photos) {
      setPhotos(modalData.photos);
    }
  }, [modalData]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>
          {mode === "edit" ? "Редактровать" : "Cоздать"} отель {mode !== "edit" && `Региона ${modalData.cityName}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Row className="mb-3">
            <Form.Label>Название:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Отель"
              name="name"
              value={state.name}
              onChange={changeState}
            />
          </Row>
          <Row className="mb-3">
            <Form.Label>Описание:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Описание отеля"
              name="description"
              value={state.description}
              onChange={changeState}
            />
          </Row>
          <Row className="mb-3">
            <Form.Label>Рейтинг:</Form.Label>
            <Form.Select
              onChange={({ target: { value } }) => changeRating(value)}
              value={state.rating}
              className="mb-2"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Form.Select>
          </Row>
          <Row className="mb-3">
            <Form.Label>Цены:</Form.Label>
            <div className="d-flex flex-column gap-2">
              <InputGroup className="m-0 p-0">
                <InputGroup.Text>₽</InputGroup.Text>
                <InputGroup.Text>Летом</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="1000"
                  name="summer"
                  value={state.summer}
                  onChange={changeState}
                />
              </InputGroup>
              <InputGroup className="m-0 p-0">
                <InputGroup.Text>₽</InputGroup.Text>
                <InputGroup.Text>Зимой</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="1000"
                  name="winter"
                  value={state.winter}
                  onChange={changeState}
                />
              </InputGroup>
              <InputGroup className="m-0 p-0">
                <InputGroup.Text>₽</InputGroup.Text>
                <InputGroup.Text>Другое</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="1000"
                  name="other"
                  value={state.other}
                  onChange={changeState}
                />
              </InputGroup>
            </div>
          </Row>
          <div className="photos-list d-flex gap-2 white-space-wrap">
            {photos.map((photo) => (
              <div className="photos-list-item">
                <div style={{ backgroundImage: `url(${getPhoto(photo)})` }} body className="photos-list-item-photo">
                  <div onClick={() => deletePhoto(photo)} className="photos-list-item-delete">
                    <i className="bi bi-trash3"></i>
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

export default ModalCreateHotel;
