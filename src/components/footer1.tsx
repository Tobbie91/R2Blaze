// src/components/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h4 className="text-xl font-semibold">About Us</h4>
            <p className="text-gray-400 mt-2">
              We are dedicated to bringing you the best in quality watches and accessories.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-xl font-semibold">Quick Links</h4>
            <ul className="mt-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/products" className="hover:text-white">Shop</Link></li>
              <li><Link to="/policies" className="hover:text-white">Policies</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-xl font-semibold">Contact</h4>
            <p className="mt-2 text-gray-400">Email: support@example.com</p>
            <p className="text-gray-400">Phone: 123-456-7890</p>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-xl font-semibold">Follow Us</h4>
            <ul className="mt-2 text-gray-400">
              <li><a href="https://facebook.com" className="hover:text-white">Facebook</a></li>
              <li><a href="https://instagram.com" className="hover:text-white">Instagram</a></li>
              <li><a href="https://twitter.com" className="hover:text-white">Twitter</a></li>
              <li><a href="https://linkedin.com" className="hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="text-center text-sm text-gray-400 mt-8">
          <p>&copy; 2023 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
