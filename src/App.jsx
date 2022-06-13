import './App.css';
import Header from './components/Header';
import { Container } from 'react-bootstrap'
import { Routes, Route } from 'react-router-dom'
import Regions from './pages/Regions';
import Home from './pages/Home';
import Payment from './pages/Payment';
import Contacts from './pages/Contacts';
import Reviews from './pages/Reviews';
import { NotificationContainer } from 'react-notifications';
import Footer from './components/Footer';

function App() {
  return (
	  <div id="container">
		  <div>
			  <Header />
			  <Container style={{ marginTop: "50px" }}>
				  <Routes>
					  <Route path="/" element={<Home />} />
					  <Route path="/regions" element={<Regions />} />
					  <Route path="/payment" element={<Payment />} />
					  <Route path="/contacts" element={<Contacts />} />
					  <Route path="/reviews" element={<Reviews />} />
				  </Routes>
			  </Container>
		  </div>
		  <Footer />
		  <NotificationContainer />
	  </div>
  );
}

export default App;
