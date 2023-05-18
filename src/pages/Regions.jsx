import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CardCity from "../components/CardCuty";
import CardsRegion from "../components/CardsRegion";
import Spinner from "../components/Spinner";
import { asyncGetCitys } from "../store/slices/citysSlice";
import { showModal } from "../store/slices/modalsSlice";

const Regions = () => {
  const dispatch = useDispatch();
  const { citys } = useSelector((state) => state.citys);
  const { isAuth, user } = useSelector((state) => state.user);

  const [loading, setloading] = useState(false);

  const getCitys = async () => {
    setloading(true);
    await dispatch(asyncGetCitys());
    setloading(false);
  };

  useEffect(() => {
    getCitys();
  }, []);

  return (
    <>
      <div className="d-flex align-items-center gap-3">
        <h1>Доступные регионы</h1>
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
      <hr />
      {loading && <Spinner />}
      <div className="cards">
        {!!citys.length &&
          !loading &&
          citys.map((city) => (
            <>
              <CardCity key={city.id} city={city} getCitys={getCitys} />
            </>
          ))}
      </div>
    </>
  );
};

export default Regions;
