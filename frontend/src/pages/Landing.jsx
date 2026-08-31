import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Faqs from "../components/landing/Faqs";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      <Navbar />
      <Hero />
      <Features />
      <Faqs />
      <Footer />
    </div>
  );
}