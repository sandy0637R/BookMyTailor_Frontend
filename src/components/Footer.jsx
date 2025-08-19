import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-brown-tertiary)] text-[var(--color-neutral-primary)] pt-16 pb-10 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-[var(--color-brown-primary)]">
              Book My Tailor
            </h2>
            <p className="text-sm text-[var(--color-neutral-primary)] leading-relaxed">
              Connecting users and tailors seamlessly. Schedule fittings, manage orders, and stay stylish with ease. Experience convenience and professionalism in every stitch.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[var(--color-brown-secondary)]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-[var(--color-brown-primary)]">Home</a></li>
              <li><a href="/tailors" className="hover:text-[var(--color-brown-primary)]">Tailors</a></li>
              <li><a href="/cloths" className="hover:text-[var(--color-brown-primary)]">Cloths</a></li>
              <li><a href="/about" className="hover:text-[var(--color-brown-primary)]">About Us</a></li>
              <li><a href="/contact" className="hover:text-[var(--color-brown-primary)]">Contact</a></li>
            </ul>
          </div>

          {/* Services / Explore */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[var(--color-brown-secondary)]">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/book-tailor" className="hover:text-[var(--color-brown-primary)]">Book a Tailor</a></li>
              <li><a href="/custom-cloths" className="hover:text-[var(--color-brown-primary)]">Custom Clothes</a></li>
              <li><a href="/order-tracking" className="hover:text-[var(--color-brown-primary)]">Order Tracking</a></li>
              <li><a href="/wishlist" className="hover:text-[var(--color-brown-primary)]">Wishlist</a></li>
              <li><a href="/cart" className="hover:text-[var(--color-brown-primary)]">Cart</a></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[var(--color-brown-secondary)]">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[var(--color-brown-primary)]" /> 123 Fashion Street, Mumbai, India
              </li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-[var(--color-brown-primary)]" /> +91 9876543210
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-[var(--color-brown-primary)]" /> support@bookmytailor.com
              </li>
            </ul>

            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-[var(--color-brown-primary)]"><FaFacebookF size={20} /></a>
              <a href="#" className="hover:text-[var(--color-brown-primary)]"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-[var(--color-brown-primary)]"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-[var(--color-brown-primary)]"><FaLinkedinIn size={20} /></a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-[var(--color-brown-secondary)] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <p className="text-sm font-semibold text-[var(--color-neutral-primary)]">
            Subscribe to our newsletter for latest updates
          </p>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-l-lg border-none outline-none flex-1"
            />
            <button className="px-4 py-2 bg-[var(--color-brown-primary)] rounded-r-lg font-semibold hover:bg-[var(--color-neutral-primary)] hover:text-[var(--color-brown-tertiary)] transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-brown-primary)] mb-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2025 Book My Tailor. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="/privacy" className="hover:text-[var(--color-brown-primary)]">Privacy Policy</a>
            <a href="/terms" className="hover:text-[var(--color-brown-primary)]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
