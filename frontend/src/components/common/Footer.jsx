import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">🛒 ShopEase</h3>
            <p className="text-sm">
              Your one-stop destination for all your shopping needs. Quality products at unbeatable prices.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-primary-400 transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-primary-400 transition-colors"><FaLinkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary-400 transition-colors">Products</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=Electronics" className="hover:text-primary-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-primary-400 transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=Books" className="hover:text-primary-400 transition-colors">Books</Link></li>
              <li><Link to="/products?category=Sports" className="hover:text-primary-400 transition-colors">Sports</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <FiMapPin className="text-primary-400" />
                <span>123 Market St, Delhi, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="text-primary-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="text-primary-400" />
                <span>support@shopease.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved. | Made by Sayed Aman</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
