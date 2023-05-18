import { Carousel } from "react-bootstrap";
import noPhoto from "../assets/images/no-image.svg";

function Slider({ photos }) {
  return (
    <Carousel>
      {photos.map((photo) => (
        <Carousel.Item className="card-image" style={{ backgroundImage: `url(${photo || noPhoto})` }}></Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Slider;
