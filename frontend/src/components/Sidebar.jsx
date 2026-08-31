import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, MessageSquare, Map, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Logo from './landing/Logo';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Chat Assistant', path: '/chat', icon: MessageSquare },
  { name: 'Roadmaps', path: '/roadmaps', icon: Map },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 68 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full bg-base-200 border-r border-base-300 flex flex-col relative z-20 shrink-0 overflow-hidden"
    >
      {/* Header row */}
      <div className="h-16 flex items-center px-4 shrink-0">
        {/* Logo + Name — only visible when expanded */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 flex-1 min-w-0 focus:outline-none"
            >
              <Logo className="w-7 h-7 shrink-0 text-primary" />
              <span className="font-bold text-lg font-sans whitespace-nowrap">
                <span className="text-primary">Path</span>
                <span className="text-secondary">Finder</span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Toggle — centered when collapsed, right-aligned when expanded */}
        <button
          onClick={() => setIsCollapsed(c => !c)}
          className={`p-1.5 rounded-lg text-base-content/50 hover:bg-base-300 hover:text-base-content transition-colors focus:outline-none shrink-0 ${
            isCollapsed ? 'mx-auto' : 'ml-auto'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed
            ? <PanelLeftOpen className="w-5 h-5" />
            : <PanelLeftClose className="w-5 h-5" />
          }
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-primary text-primary-content font-medium shadow-md shadow-primary/20'
                  : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-sans whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>
    </motion.aside>
  );
}
