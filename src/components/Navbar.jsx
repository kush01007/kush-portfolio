import { Menu } from "lucide-react";
import { navLinks, profile } from "../data/portfolioData";

const Navbar = () => {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#05080D]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 w-full items-center justify-between px-5 sm:h-16 sm:px-8 lg:px-16 xl:px-20">
        <a href="#" className="flex items-center gap-4">
          <span className="text-2xl font-semibold tracking-tight text-[#9DB7D5] sm:text-3xl">
            {profile.logoText}
          </span>
          <span className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {profile.name}
          </span>
        </a>

        <div className="hidden items-center gap-11 text-[15px] font-medium text-white/75 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-[#B7C9DE]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white md:hidden"
        >
          <Menu size={29} strokeWidth={1.8} />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
