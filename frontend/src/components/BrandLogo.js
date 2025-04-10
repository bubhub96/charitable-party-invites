import React from 'react';

const BrandLogo = () => {
  // Add a timestamp to prevent caching issues
  const timestamp = new Date().getTime();
  const logoUrl = `/images/ethical-childrens-partys-high-resolution-logo.png?v=${timestamp}`;
  
  const logoStyle = {
    height: '50px',
    display: 'block'
  };

  // Fallback text in case image doesn't load
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
  };

  const textLogoStyle = {
    display: 'none', // Hidden by default, shown if image fails
    flexDirection: 'column',
    fontFamily: "'Brush Script MT', cursive",
    lineHeight: 1,
    color: '#005c2f',
    backgroundColor: 'white',
    padding: '5px 15px',
    borderRadius: '8px',
    textAlign: 'center'
  };

  return (
    <div className="brand-logo-container">
      <img 
        src={logoUrl} 
        alt="Ethical Childrens Partys" 
        style={logoStyle} 
        onError={handleImageError}
      />
      <div style={textLogoStyle}>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Ethical</span>
        <span style={{ fontSize: '28px', fontWeight: 'bold' }}>Childrens Partys</span>
      </div>
    </div>
  );
};

export default BrandLogo;
