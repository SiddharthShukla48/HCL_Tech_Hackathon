import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      <Navbar />
      <Hero />
    </div>
  );
}