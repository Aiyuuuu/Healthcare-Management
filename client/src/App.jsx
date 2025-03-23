import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from './pages/LandingPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div>
      <Header />
      <LandingPage />
      <Footer />
    </div>
  );
}

export default App;
