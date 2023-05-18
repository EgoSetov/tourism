import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CardCity from "../components/CardCuty";
import InputSearch from "../components/InputSearch";
import Spinner from "../components/Spinner";
import { asyncGetRecommendationCitys } from "../store/slices/citysSlice";
import { showModal } from "../store/slices/modalsSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { recommendationCitys: recommendationCitysState } = useSelector((state) => state.citys);
  const { isAuth, user } = useSelector((state) => state.user);

  const [IV, setIV] = useState("");
  const [loading, setloading] = useState(false);

  const getCitys = async () => {
    setloading(true);
    await dispatch(asyncGetRecommendationCitys());
    setloading(false);
  };

  const recommendationCitys = useMemo(() => {
    return recommendationCitysState.filter((city) => city.city.toLowerCase().includes(IV.trim().toLowerCase()));
  }, [recommendationCitysState, IV]);

  const popularPlaces = useMemo(() => {
    return recommendationCitysState.map((city) => ({ text: city.city }));
  }, [recommendationCitysState]);

  useEffect(() => {
    getCitys();
  }, []);

  return (
    <>
      {/* <div className="titleImage"></div> */}
      <InputSearch IV={IV} setIV={setIV} popularPlaces={popularPlaces} />
      <hr />
      <div className="d-flex align-items-center gap-3">
        <h1>Вам может понравится</h1>
        {isAuth && user?.type === "admin" && (
          <Button
            onClick={() => {
              dispatch(showModal({ modal: "createCity", visible: true }));
            }}
            variant="success"
          >
            Создать
          </Button>
        )}
      </div>
      {loading && <Spinner />}
      <div className="cards">
        {!!recommendationCitys.length &&
          !loading &&
          recommendationCitys.map((city) => (
            <>
              <CardCity key={city.id} city={city} getCitys={getCitys} />
            </>
          ))}
      </div>
    </>
  );
};

export default Home;
