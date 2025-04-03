import styled from 'styled-components';
import { theme } from './theme';

export const Card = styled.div`
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  padding: ${theme.spacing(3)};
  transition: ${theme.transitions.standard};

  &:hover {
    box-shadow: ${theme.shadows.medium};
  }
`;

export const Button = styled.button`
  background: ${props => props.variant === 'outlined' 
    ? 'transparent' 
    : props.variant === 'secondary' 
      ? theme.colors.secondary 
      : theme.colors.primary};
  color: ${props => props.variant === 'outlined' 
    ? theme.colors.primary 
    : theme.colors.text.light};
  border: ${props => props.variant === 'outlined' 
    ? `2px solid ${theme.colors.primary}` 
    : 'none'};
  padding: ${theme.spacing(1.5)} ${theme.spacing(3)};
  border-radius: ${theme.borderRadius.medium};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transitions.standard};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing(1)};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.small};
    background: ${props => props.variant === 'outlined' 
      ? theme.colors.background.alt 
      : props.variant === 'secondary' 
        ? '#6D4C41' 
        : '#1B5E20'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing(1.5)};
  border: 1px solid ${theme.colors.divider};
  border-radius: ${theme.borderRadius.small};
  font-size: 1rem;
  transition: ${theme.transitions.standard};
  background: ${theme.colors.background.paper};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing(3)};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing(3)};
`;

export const Heading = styled.h1`
  color: ${theme.colors.text.primary};
  font-family: ${theme.typography.fontFamily};
  ${props => theme.typography[props.variant || 'h1']}
`;

const TextBase = styled.p`
  margin: ${props => props.$nomargin ? '0' : '1em 0'};
  color: ${props => props.color ? theme.colors.text[props.color] : theme.colors.text.primary};
  font-family: ${theme.typography.fontFamily};
  ${props => theme.typography[props.variant || 'body1']};
`;

export const Text = ({ nomargin, ...props }) => (
  <TextBase $nomargin={nomargin} {...props} />
);
export const Badge = styled.span`
  background: ${props => theme.colors[props.color || 'primary']};
  color: ${theme.colors.text.light};
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  border-radius: ${theme.borderRadius.small};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.divider};
  margin: ${theme.spacing(3)} 0;
`;
