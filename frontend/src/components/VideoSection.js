import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  margin-bottom: ${theme.spacing(6)};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      0deg,
      ${theme.colors.background.main} 0%,
      transparent 20%,
      transparent 80%,
      ${theme.colors.background.main} 100%
    );
    pointer-events: none;
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoSection = ({ videoSrc }) => {
  return (
    <VideoContainer>
      <Video
        autoPlay
        muted
        loop
        playsInline
        src={videoSrc}
        aria-label="Background video showing children's party activities"
      />
    </VideoContainer>
  );
};

export default VideoSection;
