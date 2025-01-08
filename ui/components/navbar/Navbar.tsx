"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

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
    { name: "Loisirs", href: "#loisirs" },
    { name: "Contacts", href: "#contacts" },
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
      className={`fixed w-full z-[999] transition-colors duration-200
        ${isTransparent ? "bg-transparent text-white" : "bg-gray-200 text-black"}
      `}
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
                ? "flex flex-col space-y-4 absolute top-full left-0 w-full text-white p-4"
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

        <div className="flex gap-8">
          <motion.a
            href="https://www.linkedin.com/in/alexis-joncour-518819296/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className=""
          >
            <Linkedin size={28} className="text-primary" />
          </motion.a>
          <motion.a
            href="https://github.com/AlexisJcr"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className=""
          >
            <Github size={28} className="text-primary" />
          </motion.a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
