import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-0">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white text-xl font-bold">Shop<span className="text-primary-400">Ease</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your one-stop destination for all your shopping needs. Quality products at unbeatable prices.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FaFacebook size={15} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FaTwitter size={15} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FaInstagram size={15} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FaLinkedin size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary-400 transition-colors">Products</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products?category=Electronics" className="hover:text-primary-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-primary-400 transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=Books" className="hover:text-primary-400 transition-colors">Books</Link></li>
              <li><Link to="/products?category=Sports" className="hover:text-primary-400 transition-colors">Sports</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <FiMapPin className="text-primary-400 flex-shrink-0" size={14} />
                <span>123 Market St, Delhi, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="text-primary-400 flex-shrink-0" size={14} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-primary-400 flex-shrink-0" size={14} />
                <span>support@shopease.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm gap-2">
          <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
          <p className="text-gray-600">Made with ❤️ by Sayed Aman</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;