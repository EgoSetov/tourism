import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncDeleteHotel } from "../store/slices/citysSlice";
import { getFullPath } from "../utils/getFullPath";
import noPhoto from "../assets/images/noPhoto.jpg";
import { showModal } from "../store/slices/modalsSlice";
import { Button, Card } from "react-bootstrap";
import Slider from "./Slider";

function CardHotel({ hotel, getCitys }) {
  const dispatch = useDispatch();

  const { isAuth, user } = useSelector((state) => state.user);

  const [loading, setLoadin] = useState(false);

  const deleteHotel = async () => {
    const resDeleteNews = await dispatch(asyncDeleteHotel(hotel.id));

    if (resDeleteNews.error) return;

    getCitys();
  };

  const getPhoto = () => {
    if (hotel.photos?.length) {
      return hotel.photos.map((photo) => {
        return getFullPath({ uploads: photo });
      });
    }
    return [noPhoto];
  };

  const edit = () => {
    dispatch(
      showModal({
        modal: "editHotel",
        visible: true,
        data: hotel,
      })
    );
  };

  return (
    <Card>
      <Card.Header>
        <div className="d-flex gap-2">
          {isAuth && user?.type === "admin" && (
            <Button onClick={() => deleteHotel(hotel.id)} variant="danger">
              Удалить
            </Button>
          )}
          {isAuth && user?.type === "admin" && (
            <Button onClick={edit} variant="success">
              Редактировать
            </Button>
          )}
        </div>
      </Card.Header>
      <Slider photos={getPhoto()} />
      <Card.Body>
        <Card.Title>Отель: {hotel.name}</Card.Title>
        {hotel.description && <Card.Text>Описание:{hotel.description}</Card.Text>}
        <Card.Text>
          <h5>Цены:</h5>
          <ul>
            <li>Лето: {hotel.price.summer}</li>
            <li>Зима: {hotel.price.winter}</li>
            <li>Другое: {hotel.price.other}</li>
          </ul>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex gap-1">
        Рейтинг:
        <div className="d-flex gap-1">
          {new Array(Number(hotel.rating)).fill(0).map(() => (
            <i className="bi bi-star"></i>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
}

export default CardHotel;
