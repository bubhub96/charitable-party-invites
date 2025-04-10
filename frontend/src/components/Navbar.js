import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';
import { Button } from '../styles/components';

const Nav = styled.nav`
  background: ${theme.colors.background.paper};
  box-shadow: ${theme.shadows.small};
  padding: ${theme.spacing(2)} 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing(3)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${theme.colors.text.primary};
  font-weight: 600;
  font-size: 1.2rem;
  gap: ${theme.spacing(2)};

  img {
    width: 300px; /* Increased from 250px (20% larger) */
    height: 96px; /* Increased from 80px (20% larger) */
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${theme.spacing(2)};
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${theme.colors.text.primary};
  text-decoration: none;
  padding: ${theme.spacing(1)} ${theme.spacing(2)};
  border-radius: ${theme.borderRadius.small};
  transition: ${theme.transitions.standard};

  &:hover {
    background: ${theme.colors.background.alt};
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <img 
            src="/images/brand/logo-2025.png" 
            alt="Ethical Children's Parties Logo" 
            onError={(e) => {
              // Fallback to text if image fails to load
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML += `<div style="color: #005c2f; font-family: 'Brush Script MT', cursive; font-size: 28px; font-weight: bold;">Ethical Childrens Partys</div>`;
            }}
          />
        </Logo>
        <NavLinks>
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/create">Create Invitation</NavLink>
              <Button variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Button as={Link} to="/register">
                Get Started
              </Button>
            </>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
