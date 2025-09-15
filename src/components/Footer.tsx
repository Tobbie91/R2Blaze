import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 (Logo and About Us) */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <img 
              src="/images/donlogo.webp"  // Path to the logo image
              alt="SupreWatch Logo"
              className="w-32 h-auto"  // Adjust the size of the logo (32px width for example)
            />
            <div>
              <h4 className="text-xl font-semibold">About Us</h4>
              <p className="text-gray-400 mt-2">
                We are dedicated to bringing you the best in quality watches and accessories.
              </p>
            </div>
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
            <p className="mt-2 text-gray-400">Email: r2blaze@gmail.com</p>
            <p className="text-gray-400">Phone: +234 701 823 9270</p>
            {/* WhatsApp link */}
            <p className="mt-4">
              <a
                href="https://wa.me/2347018239270"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white py-3 px-6 rounded-full hover:bg-green-700 transition-all duration-200"
              >
                Chat with us on WhatsApp
              </a>
            </p>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-xl font-semibold">Follow Us</h4>
            <ul className="mt-2 text-gray-400">

              <li><a href="https://instagram.com/R2blazewristwatchh" className="hover:text-white">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@r2blazewristwatch" className="hover:text-white">TikTok</a></li>
              <li><a href="https://www.snapchat.com/add/donblazing" className="hover:text-white">Snapchat</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="text-center text-sm text-gray-400 mt-8">
          <p>&copy; 2023 R2Blaze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
