import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { MessageSquare } from 'lucide-react';
import Logo from "./Logo";

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-base-100/90 backdrop-blur-lg border-base-content/10 py-3 shadow-sm' : 'bg-transparent border-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Logo className="w-8 h-8" />
          <div className="flex items-center text-2xl">
            <span className="font-sans font-bold text-primary text-3xl">Path</span>
            <span className="font-sans font-bold text-secondary text-3xl">Finder</span>
          </div>
        </a>
      
      <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium text-base-content/80">
        <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer">Home</a>
        <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer">Features</a>
        <a href="#faqs" onClick={(e) => { e.preventDefault(); document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary transition-colors cursor-pointer">FAQs</a>
      </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => navigate('/chat')}
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-content font-medium text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>
    </nav>
  );
}
