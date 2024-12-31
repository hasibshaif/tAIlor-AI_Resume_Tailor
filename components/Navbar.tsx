"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { IoIosBowtie } from "react-icons/io";
import { IoSparklesSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Desktop and Tablet Navbar */}
      <motion.nav
        initial={{ opacity: 1, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="fixed inset-x-0 top-0 mx-auto bg-gradient-to-br from-[#062047] via-[#16243b] to-[#1a163b] text-white shadow-lg rounded-full border border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between max-w-full sm:px-8 sm:py-4 sm:max-w-4xl z-50"
      >
        {/* Logo Section */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-lilitaOne flex items-center justify-center gap-1"
        >
          <div className="tracking-wider">
            t<span className="text-yellow-400">AI</span>lor
          </div>
          <IoIosBowtie size={24} className="text-white sm:size-30" />
          <IoSparklesSharp size={20} className="text-yellow-400 sm:size-25" />
        </Link>

        {/* Hamburger Menu Icon for Small Screens */}
        <div className="sm:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center space-x-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 text-sm sm:text-base bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="fixed top-16 inset-x-0 bg-gradient-to-br from-[#062047] via-[#16243b] to-[#1a163b] text-white shadow-lg rounded-lg p-6 sm:hidden z-50"
        >
          <div className="flex flex-col items-center space-y-4">
            <Link
              href="/"
              className="text-lg font-bold text-white hover:text-yellow-400"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </motion.div>
      )}
    </>
  );
}
