import React from 'react';
import styled from 'styled-components';

const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  background: #000;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg,
      rgba(46, 125, 50, 0.85) 0%,
      rgba(61, 139, 64, 0.85) 30%,
      rgba(74, 145, 67, 0.85) 70%,
      rgba(255, 143, 0, 0.85) 100%
    );
    z-index: 2;
  }

  video {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vw;
    height: 56.25vw; /* maintain 16:9 aspect ratio */
    min-height: 100vh;
    min-width: 177.77vh; /* maintain 16:9 aspect ratio */
    transform: translate(-50%, -50%);
    object-fit: cover;
    pointer-events: none;
    z-index: 1;
  }
`;

const VideoBackground = () => {
  return (
    <VideoWrapper>
      <video
        autoPlay
        muted
        loop
        playsInline
        src="/videos/party-background.mp4"
        type="video/mp4"
      />
    </VideoWrapper>
  );
};

export default VideoBackground;
