import "./App.css";
import Header from "./components/Header";
import { Container, Spinner } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import Regions from "./pages/Regions";
import Home from "./pages/Home";
import Payment from "./pages/Payment";
import Contacts from "./pages/Contacts";
import Reviews from "./pages/Reviews";
import { NotificationContainer } from "react-notifications";
import Footer from "./components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import ModalLogin from "./components/modals/ModalLogin";
import ModalSignup from "./components/modals/ModalSignup";
import { useEffect, useState } from "react";
import { asyncConnect } from "./store/slices/userSlice";
import ModalComments from "./components/modals/ModalComments";
import ModalCreateCity from "./components/modals/ModalCreateCity";
import ModalCreateHotel from "./components/modals/ModalCreateHotel";
import ModalCreateQuestion from "./components/modals/ModalCreateQuestion";

function App() {
  const dispatch = useDispatch();

  const modals = useSelector((state) => state.modals);

  const [loadin, setLoding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        setLoding(true);
        await dispatch(asyncConnect());
        setLoding(false);
      })();
    }
  }, []);
  return (
    <div id="container">
      <div>
        <Header />
        <Container style={{ marginTop: "50px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/regions" element={<Regions />} />
            <Route path="/payment" element={<Payment />} />
            {/* <Route path="/contacts" element={<Contacts />} /> */}
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </Container>
      </div>
      <Footer />
      <NotificationContainer />

      {/* modals */}
      {modals.signin.visible && <ModalLogin />}
      {modals.signup.visible && <ModalSignup />}
      {modals.comments.visible && <ModalComments />}

      {modals.createCity.visible && <ModalCreateCity />}
      {modals.editCity.visible && <ModalCreateCity mode="edit" />}

      {modals.createHotel.visible && <ModalCreateHotel />}
      {modals.editHotel.visible && <ModalCreateHotel mode="edit" />}

      {modals.createQuestion.visible && <ModalCreateQuestion />}
      {modals.editQuestion.visible && <ModalCreateQuestion mode="edit" />}

      {loadin && (
        <div className="loadin">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
}

export default App;
