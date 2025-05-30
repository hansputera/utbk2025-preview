import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} <NavLink to="https://github.com/hansputera">Hanif Dwy Putra S</NavLink>. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <NavLink to="https://snbtx.mnct.eu.org" target="_blank" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              snbtx.mnct.eu.org
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
