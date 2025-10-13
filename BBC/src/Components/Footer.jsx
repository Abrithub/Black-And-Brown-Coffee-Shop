import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social media links
  const socialMediaLinks = [
    {
      name: "Facebook",
      icon: FaFacebook,
      url: "https://facebook.com/blackandbrowncoffee",
      color: "hover:text-blue-600"
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://instagram.com/blackandbrowncoffee",
      color: "hover:text-pink-600"
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      url: "https://twitter.com/blackandbrowncoffee",
      color: "hover:text-blue-400"
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      url: "https://youtube.com/blackandbrowncoffee",
      color: "hover:text-red-600"
    }
  ];

  // Quick links
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Menu", href: "#menu" },
    { name: "Products", href: "#products" },
    { name: "Promotions", href: "#promotions" },
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#contact" }
  ];

  // Account & Policies links
  const accountPolicies = [
    { name: "Sign In", href: "#", type: "auth" },
    { name: "Create Account", href: "#", type: "auth" },
    { name: "Privacy Policy", href: "#", type: "policy" },
    { name: "Terms of Service", href: "#", type: "policy" },
    { name: "Shipping Policy", href: "#", type: "policy" },
    { name: "Return Policy", href: "#", type: "policy" }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthClick = () => {
    // This would trigger your auth modal
    console.log('Auth button clicked');
  };

  return (
    <footer className="bg-[#1a0f0a] border-t border-[#5D4030]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-[#C19976]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 6h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2v5a7 7 0 0 1-14 0V6h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1zm-2 0H4v5a5 5 0 1 0 10 0V6z"/>
                </svg>
              </div>
              <span className="text-lg font-bold">
                <span className="text-[#C19976]">Black</span> & <span className="text-[#A0522D]">Brown</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Experience the finest Ethiopian coffee tradition crafted with passion and precision.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-3">
              {socialMediaLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-colors duration-300 transform hover:scale-110`}
                  title={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-bold text-[#C19976] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-[#C19976] transition-colors duration-200 text-left text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Policies */}
          <div>
            <h3 className="text-md font-bold text-[#C19976] mb-4">Account & Policies</h3>
            <ul className="space-y-2">
              {accountPolicies.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.type === 'auth' ? handleAuthClick : () => {}}
                    className="text-gray-300 hover:text-[#C19976] transition-colors duration-200 text-left text-sm"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-md font-bold text-[#C19976] mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <FaMapMarkerAlt className="w-4 h-4 text-[#C19976] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Addis Ababa, Ethiopia</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <FaPhone className="w-4 h-4 text-[#C19976] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">+251 912 345 678</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <FaEnvelope className="w-4 h-4 text-[#C19976] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">contact@blackbrown.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <FaClock className="w-4 h-4 text-[#C19976] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Mon-Sun: 7:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#5D4030]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-gray-400 text-xs">
              © {currentYear} Black & Brown Coffee Shop. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center space-x-4 text-xs">
              <button className="text-gray-400 hover:text-[#C19976] transition-colors duration-200">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-[#C19976] transition-colors duration-200">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;