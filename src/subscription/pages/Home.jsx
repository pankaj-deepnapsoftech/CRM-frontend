import React from "react";
import HeroSection from "../components/Hero Section/HeroSection";
import Clients from "../components/Clients/Clients";
import Features from "../components/features/Features";
import Technologies from "../components/Technologies/Technologies";
import Pricing from "../components/Pricing/Pricing";

const Home = ({showAuthenticationMenu, setShowAuthenticationMenu}) => {
  return (
    <div>
      <HeroSection />
      <Clients />
      <Features />
      <Technologies />
      <Pricing showAuthenticationMenu={showAuthenticationMenu} setShowAuthenticationMenu={setShowAuthenticationMenu} />
    </div>
  );
};

export default Home;
