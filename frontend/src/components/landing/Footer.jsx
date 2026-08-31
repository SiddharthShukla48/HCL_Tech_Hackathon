import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden border-t border-base-300/30">
      {/* Background Watermark */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none flex justify-center opacity-5">
        <h1 className="text-[15vw] font-display font-bold text-base-content leading-none whitespace-nowrap">
          PathFinder
        </h1>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-8">
            <div className="flex items-center gap-2 mb-6">
              <Logo className="w-8 h-8" />
              <div className="flex items-center text-xl">
                <span className="font-sans font-bold text-primary text-2xl">Path</span>
                <span className="font-sans font-bold text-secondary text-2xl">Finder</span>
              </div>
            </div>
            <p className="text-base-content/70 font-sans max-w-sm leading-relaxed mb-8">
              Persistent mentor for self-guided learners. Set your goals once, chat normally, roadmaps adapt automatically.
            </p>
            <p className="text-sm font-sans text-base-content/40">
              &copy; {new Date().getFullYear()} PathFinder. All rights reserved
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="md:col-span-2">
            <h4 className="font-bold font-sans text-base-content mb-6">Product</h4>
            <ul className="space-y-4 font-sans text-base-content/70 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="md:col-span-2">
            <h4 className="font-bold font-sans text-base-content mb-6">Connect</h4>
            <ul className="space-y-4 font-sans text-base-content/70 text-sm">
              <li>
                <a href="#" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
