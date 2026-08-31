import { mockUser } from '../data/mockUser';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  // Single initial only
  const initial = mockUser.name.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-base-100 flex items-center justify-end px-6 shrink-0 gap-6">
      <ThemeToggle />
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-base-200 border border-base-300">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-sm shrink-0">
          {initial}
        </div>
        <span className="font-sans font-medium text-sm text-base-content pr-2">
          {mockUser.name}
        </span>
      </div>
    </header>
  );
}
