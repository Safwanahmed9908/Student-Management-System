import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <p className="footer-text">
          Student Management System &bull; College Term Work-2 Project &bull; MERN Stack
        </p>
        <p className="footer-subtext">
          &copy; {currentYear} All Rights Reserved. Built with MongoDB, Express.js, React, Node.js.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
