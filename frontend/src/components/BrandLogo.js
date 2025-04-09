import React from 'react';

const BrandLogo = () => {
  const logoStyle = {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Brush Script MT', cursive",
    lineHeight: 1,
    color: '#005c2f',
    backgroundColor: 'white',
    padding: '5px 15px',
    borderRadius: '8px',
    textAlign: 'center'
  };

  const topTextStyle = {
    fontSize: '24px',
    fontWeight: 'bold'
  };

  const bottomTextStyle = {
    fontSize: '28px',
    fontWeight: 'bold'
  };

  return (
    <div style={logoStyle}>
      <span style={topTextStyle}>Ethical</span>
      <span style={bottomTextStyle}>Childrens Partys</span>
    </div>
  );
};

export default BrandLogo;
