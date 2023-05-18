import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { asyncDeleteCity, asyncLikeCity } from "../store/slices/citysSlice";
import { getFullPath } from "../utils/getFullPath";
import noPhoto from "../assets/images/no-image.svg";
import { showModal } from "../store/slices/modalsSlice";
import Slider from "./Slider";
import CardHotel from "./CardHotel";

function CardCity({ city, getCitys }) {
  const dispatch = useDispatch();

  const { isAuth, user } = useSelector((state) => state.user);

  const [visibleHotelList, setVisibleHotelList] = useState(false);
  const [likes, setLikes] = useState(city.likes || []);
  const [loading, setLoadin] = useState(false);

  const likeCity = async () => {
    setLoadin(true);
    const resLikeCity = await dispatch(asyncLikeCity(city.id));
    setLoadin(false);
    if (resLikeCity.error) return;

    if (likes.includes(user?.id)) {
      setLikes((prev) => prev.filter((l) => l !== user?.id));
    } else {
      setLikes((prev) => [...prev, user?.id]);
    }
  };

  const deleteCity = async () => {
    const resDeleteNews = await dispatch(asyncDeleteCity(city.id));

    if (resDeleteNews.error) return;

    getCitys();
  };

  const getPhoto = () => {
    if (city.photos?.length) {
      return city.photos.map((photo) => {
        return getFullPath({ uploads: photo });
      });
    }
    return [noPhoto];
  };

  const isLike = () => {
    return likes.includes(user?.id);
  };

  const edit = () => {
    dispatch(showModal({ modal: "editCity", visible: true, data: city }));
  };

  const createHotel = () => {
    dispatch(
      showModal({
        modal: "createHotel",
        visible: true,
        data: {
          cityId: city.id,
          cityName: city.city,
        },
      })
    );
  };

  const showComments = () => {
    dispatch(showModal({ modal: "comments", visible: true, data: city }));
  };

  const showHotels = () => {
    if (!city.hotels.length) return;

    setVisibleHotelList((prev) => !prev);
  };

  return (
    <Card>
      <Card.Header>
        <div className="d-flex gap-2">
          {isAuth && user?.type === "admin" && (
            <Button onClick={() => deleteCity(city.id)} variant="danger">
              Удалить
            </Button>
          )}
          {isAuth && user?.type === "admin" && (
            <Button onClick={edit} variant="success">
              Редактировать
            </Button>
          )}
          {isAuth && user?.type === "admin" && (
            <Button onClick={createHotel} variant="success" className="d-flex gap-1">
              <i className="bi bi-plus"></i>
              Отель
            </Button>
          )}
        </div>
      </Card.Header>
      <Slider photos={getPhoto()} />
      <Card.Body>
        <Card.Title>{city.city}</Card.Title>
        <Card.Text>{city.description}</Card.Text>
      </Card.Body>
      {isAuth ? (
        <Card.Footer className="text-muted d-flex gap-3">
          {isLike() ? (
            <Button disabled={loading} onClick={likeCity} variant="dark">
              <i className="bi bi-heartbreak"> {likes.length || 0}</i>
            </Button>
          ) : (
            <Button disabled={loading} onClick={likeCity} variant="danger">
              <i className="bi bi-heart"> {likes.length || 0}</i>
            </Button>
          )}
          <Button onClick={showComments} variant="primary">
            <i className="bi bi-card-text"> Комментарии</i>
          </Button>
        </Card.Footer>
      ) : (
        <Card.Footer>
          <i className="bi bi-heart"> {likes.length || 0}</i>
        </Card.Footer>
      )}
      <Card.Footer onClick={showHotels} className="show-hotel">
        <div className="d-flex aling-center-center gap-1">
          <span className="text-black">Отелей: {city.hotels.length} </span>
          {visibleHotelList ? <i className="bi bi-caret-down-fill rotate-180"></i> : <i className="bi bi-caret-down-fill"></i>}
        </div>
      </Card.Footer>
      {visibleHotelList && (
        <div className="hotel-list shadow-none p-3 m-3 bg-light rounded">
          {city.hotels.map((hotel) => (
            <CardHotel getCitys={getCitys} hotel={hotel} />
          ))}
        </div>
      )}
    </Card>
  );
}

export default CardCity;
