import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, profile } from "../data/portfolioData";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#05080D]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 w-full items-center justify-between px-5 sm:h-16 sm:px-8 lg:px-16 xl:px-20">
        <a href="#" onClick={closeMenu} className="flex items-center gap-4">
          <span className="text-2xl font-semibold tracking-tight text-[#9DB7D5] sm:text-3xl">
            {profile.logoText}
          </span>

          <span className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {profile.name}
          </span>
        </a>

        {/* Desktop Links */}
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#080D13]/80 text-white transition hover:border-[#9DB7D5]/40 md:hidden"
        >
          {isMenuOpen ? (
            <X size={27} strokeWidth={1.8} />
          ) : (
            <Menu size={29} strokeWidth={1.8} />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        } transition-opacity duration-200`}
      >
        <div
          onClick={closeMenu}
          className="fixed inset-0 top-14 bg-black/45 backdrop-blur-sm sm:top-16"
        />

        <div
          className={`absolute left-4 right-4 top-[64px] overflow-hidden rounded-2xl border border-white/10 bg-[#080D13]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 sm:left-8 sm:right-8 sm:top-[74px] ${
            isMenuOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-3 scale-[0.98] opacity-0"
          }`}
        >
          <div className="flex flex-col p-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-[15px] font-medium text-white/75 transition hover:bg-white/[0.04] hover:text-[#B7C9DE]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;