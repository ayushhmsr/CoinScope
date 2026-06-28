import React, { useState } from "react";
import "./App.css";
import LoadingScreen from "./Components/LoadingScreen";
import Navbar from "./Components/navbar";
import Content from "./Components/content";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import About from "./Components/about";
import Features from "./blog";
import Pricing from "./Components/Pricing";
import CoinDetail from "./Components/CoinDetail";
import CoinSearch from "./Components/CoinSearch";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <CurrencyProvider>
      <div className="flex flex-col min-h-screen w-screen" style={{
        backgroundColor: '#000000',
        backgroundImage: 'radial-gradient(#ffffff33 1px, #00091d 1px)',
        backgroundSize: '20px 20px'
      }}>
        <div className="flex-grow relative z-10">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/landing" element={<Content />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Features />} />
            <Route path="/crypto" element={<CoinSearch />} />
            <Route path="/crypto/:coinId" element={<CoinDetail />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </CurrencyProvider>
  );
}
export default App;
