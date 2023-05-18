import { useEffect, useState } from "react";
import { Button, Card, Carousel, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { asyncDeleteNews, asyncGetNews, asyncLikeNews } from "../store/slices/newsSlice";
import noPhoto from "../assets/images/no-image.svg";
import { getFullPath } from "../utils/getFullPath";
import { showModal } from "../store/slices/modalsSlice";

// * страница постов
const News = () => {
  const dispatch = useDispatch();

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoadin] = useState(true);

  // * получение состаяния из глобального стейта
  const { news, count } = useSelector((state) => state.news);
  const { isAuth, user } = useSelector((state) => state.user);

  const getNews = async () => {
    setLoadin(true);
    await dispatch(asyncGetNews({ page: 1 }));
    setLoadin(false);
  };

  useEffect(() => {
    getNews();
  }, []);

  useEffect(() => {
    setNewsList(news);
  }, [news]);

  return (
    <div>
      <div className="container">
        <div className="d-flex align-items-center gap-3">
          <h1>Новостей {count}</h1>
          {isAuth && user.type === "admin" && (
            <Button
              onClick={() => {
                dispatch(showModal({ modal: "createNews", visible: true }));
              }}
            >
              Создать
            </Button>
          )}
        </div>
        <hr />
        {loading && <Spinner />}
        <div className="cards">
          {newsList.map((n) => (
            <CardNews post={n} getNews={getNews} />
          ))}
        </div>
      </div>
    </div>
  );
};

function CardNews({ post, getNews }) {
  const dispatch = useDispatch();

  const { isAuth, user } = useSelector((state) => state.user);

  const [likes, setLikes] = useState(post.likes || []);
  const [loading, setLoadin] = useState(false);

  const likeNews = async () => {
    setLoadin(true);
    const resLikeNews = await dispatch(asyncLikeNews(post.id));
    setLoadin(false);
    if (resLikeNews.error) return;

    if (likes.includes(user?.id)) {
      setLikes((prev) => prev.filter((l) => l !== user?.id));
    } else {
      setLikes((prev) => [...prev, user?.id]);
    }
  };

  const deleteNews = async () => {
    const resDeleteNews = await dispatch(asyncDeleteNews(post.id));

    if (resDeleteNews.error) return;

    getNews();
  };

  const getPhoto = () => {
    if (post.photos?.length) {
      return post.photos.map((photo) => {
        return getFullPath({ uploads: photo });
      });
    }
    return [noPhoto];
  };

  const isLike = () => {
    return likes.includes(user?.id);
  };

  const getCreator = () => {
    if (post.creator) {
      return `${post.creator.surname} ${post.creator.name}`;
    } else {
      return "Пользователь не найден";
    }
  };

  const edit = () => {
    dispatch(showModal({ modal: "editNews", visible: true, data: post }));
  };

  return (
    <Card>
      <Card.Header>
        <div className="d-flex gap-2">
          {isAuth && (user?.type === "admin" || post?.creator?.id === user?.id) && (
            <Button onClick={() => deleteNews(post.id)} variant="danger">
              Удалить
            </Button>
          )}
          {isAuth && (user?.type === "admin" || post?.creator?.id === user?.id) && (
            <Button onClick={edit} variant="success">
              Редактировать
            </Button>
          )}
        </div>
      </Card.Header>
      <Slider photos={getPhoto()} />
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.description}</Card.Text>
      </Card.Body>
      {isAuth ? (
        <Card.Footer className="text-muted d-flex gap-3">
          {isLike() ? (
            <Button disabled={loading} onClick={likeNews} variant="dark">
              <i class="bi bi-heartbreak"> {likes.length || 0}</i>
            </Button>
          ) : (
            <Button disabled={loading} onClick={likeNews} variant="danger">
              <i class="bi bi-heart"> {likes.length || 0}</i>
            </Button>
          )}
        </Card.Footer>
      ) : (
        <Card.Footer>
          <i class="bi bi-heart"> {likes.length || 0}</i>
        </Card.Footer>
      )}
      <Card.Footer>
        <span className="text-muted">Автор: {getCreator()}</span>
      </Card.Footer>
    </Card>
  );
}

function Slider({ photos }) {
  return (
    <Carousel className="carousel">
      {photos.map((photo) => {
        return (
          <Carousel.Item className="card-image" style={{ backgroundImage: `url(${photo || noPhoto})` }}></Carousel.Item>
        );
      })}
    </Carousel>
  );
}

export default News;
