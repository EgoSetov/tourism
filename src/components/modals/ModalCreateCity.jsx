"react-router-dom";

import { useEffect, useState } from "react";
import { Button, Modal, Form, Row, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  asyncCreateCity,
  asyncGetCitys,
  asyncGetRecommendationCitys,
  asyncUpdateCity,
} from "../../store/slices/citysSlice";
import { showModal } from "../../store/slices/modalsSlice";
import { getFullPath } from "../../utils/getFullPath";

const ModalCreateCity = ({ mode }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const modals = useSelector((state) => state.modals);

  const modalData = mode === "edit" ? modals.editCity.data : modals.createCity.data;

  const show = mode === "edit" ? modals.editCity.visible : modals.createCity.visible;

  const modalName = mode === "edit" ? "editCity" : "createCity";

  const [photos, setPhotos] = useState([]);

  const [state, setState] = useState({
    city: modalData?.city || "",
    description: modalData?.description || "",
    recommendation: modalData?.recommendation || false,
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

  const onRecommendation = () => {
    setState((prev) => ({
      ...prev,
      recommendation: !prev.recommendation,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!state.city) return;

    const formData = new FormData();

    formData.append("city", state.city);
    formData.append("description", state.description);
    formData.append("recommendation", state.recommendation);

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
      res = await dispatch(asyncUpdateCity({ cityId: modalData.id, data: formData }));
    } else {
      res = await dispatch(asyncCreateCity(formData));
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
    if (modalData) {
      setPhotos(modalData.photos);
    }
  }, [modalData]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>{mode === "edit" ? "Редактровать" : "создать"} город</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Row className="mb-3">
            <Form.Label>Заголовок:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Город"
              name="city"
              value={state.city}
              onChange={changeState}
            />
          </Row>
          <Row className="mb-3">
            <Form.Label>Описание:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Описание города"
              name="description"
              value={state.description}
              onChange={changeState}
            />
          </Row>
          <Row className="mb-3">
            <Form.Check
              onClick={onRecommendation}
              checked={state.recommendation}
              type="switch"
              id="custom-switch"
              label="Рекомендовать"
            />
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

export default ModalCreateCity;
