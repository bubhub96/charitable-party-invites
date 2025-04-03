// React and third-party imports
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Context imports
import { useAuth } from '../context/AuthContext';

// Component imports
import VideoBackground from '../components/VideoBackground';
import { Container, Heading, Text, Button, Card, Grid } from '../styles/components';

// Theme and assets
import { theme } from '../styles/theme';
import giftIcon from '../assets/gift.svg';
import charityIcon from '../assets/charity.svg';
import rsvpIcon from '../assets/rsvp.svg';

const HeroSection = styled.section`
  position: relative;
  color: ${theme.colors.text.light};
  padding: ${theme.spacing(12)} 0;
  min-height: 90vh;
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: ${theme.spacing(6)};
  overflow: hidden;
  background: transparent;
  
  ${Container} {
    position: relative;
    z-index: 3;
  }
`;

const FeatureCard = styled(Card)`
  text-align: center;
  padding: ${theme.spacing(4)};

  img {
    width: 80px;
    height: 80px;
    margin-bottom: ${theme.spacing(3)};
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const WelcomeBanner = styled(Card)`
  margin-bottom: ${theme.spacing(4)};
  background: ${theme.colors.background.alt};
  border-left: 4px solid ${theme.colors.primary};
`;

const StepCard = styled(Card)`
  position: relative;
  padding-left: ${theme.spacing(8)};
  margin-bottom: ${theme.spacing(2)};

  .step-number {
    position: absolute;
    left: ${theme.spacing(2)};
    top: 50%;
    transform: translateY(-50%);
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    background: ${theme.colors.primary};
    color: ${theme.colors.text.light};
    border-radius: ${theme.borderRadius.circle};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
`;

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div>
      {user && (
        <Container>
          <WelcomeBanner>
            <Heading variant="h2">Welcome, {user.name}! 👋</Heading>
            <Text nomargin>Ready to create your charitable party invitation?</Text>
          </WelcomeBanner>
        </Container>
      )}

      <HeroSection>
        <VideoBackground />
        <Container>
          <Heading style={{ color: theme.colors.text.light, fontSize: '3.5rem', marginBottom: theme.spacing(3) }}>
            Ethical Children's Parties
          </Heading>
          <Text style={{ color: theme.colors.text.light, fontSize: '1.8rem', maxWidth: '800px', margin: '0 auto' }} variant="h3">
            Create meaningful celebrations that teach children about giving back
          </Text>
          <StyledLink to="/create">
            <Button style={{ marginTop: theme.spacing(3) }}>
              Create an Invitation
            </Button>
          </StyledLink>
        </Container>
      </HeroSection>

      <Container>
        <Grid>
          <FeatureCard>
            <img src={giftIcon} alt="Gift box illustration" />
            <Heading variant="h3">One Special Gift</Heading>
            <Text nomargin>
              Your child receives one meaningful present from their gift fund
            </Text>
          </FeatureCard>

          <FeatureCard>
            <img src={charityIcon} alt="Charity heart illustration" />
            <Heading variant="h3">Support Charities</Heading>
            <Text nomargin>
              90% of donations go to your chosen charity
            </Text>
          </FeatureCard>

          <FeatureCard>
            <img src={rsvpIcon} alt="RSVP envelope illustration" />
            <Heading variant="h3">Easy RSVP</Heading>
            <Text nomargin>
              Simple online invitation management
            </Text>
          </FeatureCard>
        </Grid>

        <Card style={{ marginTop: theme.spacing(6) }}>
          <Heading variant="h2" style={{ textAlign: 'center' }}>How It Works</Heading>
          
          <StepCard>
            <div className="step-number">1</div>
            <Heading variant="h3">Create Invitation</Heading>
            <Text nomargin>Set up your child's party details and choose a charity</Text>
          </StepCard>

          <StepCard>
            <div className="step-number">2</div>
            <Heading variant="h3">Share</Heading>
            <Text nomargin>Send invitations to friends and family</Text>
          </StepCard>

          <StepCard>
            <div className="step-number">3</div>
            <Heading variant="h3">Collect Donations</Heading>
            <Text nomargin>Guests contribute to the charity and gift fund</Text>
          </StepCard>

          <StepCard>
            <div className="step-number">4</div>
            <Heading variant="h3">Make Impact</Heading>
            <Text nomargin>Help others while celebrating your child</Text>
          </StepCard>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
