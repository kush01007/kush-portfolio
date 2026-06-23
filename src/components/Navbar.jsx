import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, profile } from "../data/portfolioData";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#05080D]">
      <nav className="mx-auto flex h-14 w-full items-center justify-between px-5 sm:h-16 sm:px-8 lg:px-16 xl:px-20">
        <a href="#" onClick={closeMenu} className="flex items-center gap-4">
          <span className="text-2xl font-semibold tracking-tight text-[#9DB7D5] sm:text-3xl">
            {profile.logoText}
          </span>

          <span className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {profile.name}
          </span>
        </a>

        {/* Desktop Menu */}
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

        {/* Mobile Button */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center border border-white/15 bg-[#05080D] text-white transition hover:bg-[#0B1118] md:hidden"
        >
          {isMenuOpen ? (
            <X size={29} strokeWidth={1.8} />
          ) : (
            <Menu size={30} strokeWidth={1.8} />
          )}
        </button>
      </nav>

      {/* Mobile Menu + Outside Click Backdrop */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-40 md:hidden sm:top-16">
          {/* Outside area */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="absolute inset-0 h-full w-full bg-black/70"
          />

          {/* Menu Panel */}
          <div className="relative z-10 w-full border-b border-white/10 bg-[#05080D] shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="border-t border-white/10 px-5 py-4 text-[15px] font-semibold tracking-[-0.01em] text-white transition hover:bg-[#0B1118] hover:text-[#B7C9DE] sm:px-8"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;