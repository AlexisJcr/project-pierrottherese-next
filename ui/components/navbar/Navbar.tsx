"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [isTransparent, setIsTransparent] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Accueil", href: "#accueil" },
    { name: "À Propos", href: "#about" },
    { name: "Formation", href: "#formation" },
    { name: "Expérience", href: "#experience" },
    { name: "Compétences", href: "#skills" },
    // { name: 'Projets', href: '#projets' },
    // { name: 'Loisirs', href: '#loisirs' },
    // { name: 'Contacts', href: '#contacts' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const formationTop = aboutSection.offsetTop;
        setIsTransparent(window.scrollY < formationTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed w-full z-[999] transition-colors duration-200 ${
        isTransparent ? "bg-transparent text-white" : "bg-gray-200 text-black"
      }`}
    >
      <div className="ml-5 mr-5 flex justify-between items-center p-6">
        <div className="flex items-center">
          <button
            className="lg:hidden mr-4 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FaBars size={24} />
          </button>
          <ul
            className={`lg:flex lg:space-x-5 transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "flex flex-col space-y-4 absolute top-full left-0 w-full bg-transparent text-black p-4"
                : "hidden"
            }`}
          >
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-xl font-semibold transition-colors duration-200 ease-in-out hover:text-gray-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <a
          href="https://www.linkedin.com/in/alexis-joncour-518819296/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl transition-colors duration-200 hover:text-gray-300 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
