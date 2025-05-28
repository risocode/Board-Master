import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import SpaceButton from './SpaceButton';

interface MaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  courseName?: string;
  message?: string;
  onChangeCourse?: () => void;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ open, onClose, courseName, onChangeCourse }) => {
  if (!open) return null;
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Card courseName={courseName} onChangeCourse={onChangeCourse} />
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  transition: color 0.2s;
  &:hover {
    color: #f87171;
  }
`;

const Card: React.FC<{ courseName?: string; onChangeCourse?: () => void }> = ({ courseName, onChangeCourse }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="stars-bg">
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />
          <div className="star" />

        </div>
        <Image
          src="https://uiverse.io/astronaut.png"
          alt="Astronaut"
          width={192}
          height={192}
          className="image"
          priority
        />
        {courseName && (
          <div className="course-name">{courseName} <br /> <span className="is-label">Is Currently</span></div>
        )}
        <div className="heading">Under Development</div>
        {onChangeCourse && (
          <div style={{ marginTop: '0em' }}>
            <SpaceButton label="Change Course" onClick={onChangeCourse} />
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 19em;
    height: 25em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #171717;
    color: white;
    font-family: Montserrat;
    font-weight: bold;
    padding: 1em 2em 1em 1em;
    border-radius: 20px;
    overflow: hidden;
    z-index: 1;
    row-gap: 1em;
  }
  .card .image {
    width: 12em !important;
    height: 12em !important;
    margin-right: 1em;
    animation: move 10s ease-in-out infinite;
    z-index: 5;
  }
  .image:hover {
    cursor: -webkit-grab;
    cursor: grab;
  }
  .course-name {
    font-size: 1.5em;
    font-weight: 900;
    margin: 0.1em 0;
    text-align: center;
    color: #fbbf24;
    text-shadow: 0 2px 8px #fbbf2477, 0 1px 0 #fff4;
    letter-spacing: 0.01em;
    line-height: 1.1;
  }
  .is-label {
    color: #fff;
    font-size: 1em;
    font-weight: 400;
    margin: 0.05em 0;
    text-align: center;
  }
  .card::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    inset: -3px;
    border-radius: 10px;
    background: radial-gradient(#858585, transparent, transparent);
    transform: translate(-5px, 250px);
    transition: 0.4s ease-in-out;
    z-index: -1;
  }
  .card:hover::before {
    width: 150%;
    height: 100%;
    margin-left: -4.25em;
  }
  .card::after {
    content: "";
    position: absolute;
    inset: 2px;
    border-radius: 20px;
    background: rgb(23, 23, 23, 0.7);
    transition: all 0.4s ease-in-out;
    z-index: -1;
  }
  .heading {
    z-index: 2;
    transition: 0.4s ease-in-out;
    font-size: 1.5em;
    text-align: center;
  }
  .card:hover .heading {
    letter-spacing: 0.025em;
  }
  .heading::after {
    content: "";
    top: -8.5%;
    left: -8.5%;
    position: absolute;
    width: 7.5em;
    height: 7.5em;
    border: none;
    outline: none;
    border-radius: 50%;
    background: #f9f9fb;
    box-shadow: 0px 0px 100px rgba(193, 119, 241, 0.8),
      0px 0px 100px rgba(135, 42, 211, 0.8), inset #9b40fc 0px 0px 40px -12px;
    transition: 0.4s ease-in-out;
    z-index: -1;
  }
  .card:hover .heading::after {
    box-shadow: 0px 0px 200px rgba(193, 119, 241, 1),
      0px 0px 200px rgba(135, 42, 211, 1), inset #9b40fc 0px 0px 40px -12px;
  }
  .image:active {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }
  @keyframes move {
    0% {
      transform: translateX(0em) translateY(0em);
    }
    25% {
      transform: translateY(-1em) translateX(-1em);
      rotate: -10deg;
    }
    50% {
      transform: translateY(1em) translateX(-1em);
    }
    75% {
      transform: translateY(-1.25em) translateX(1em);
      rotate: 10deg;
    }
    100% {
      transform: translateX(0em) translateY(0em);
    }
  }
  .stars-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    opacity: 0.8;
    animation: twinkle 2s infinite alternate;
  }
  .star:nth-child(1) { top: 20px; left: 40px; animation-delay: 0s; }
  .star:nth-child(2) { top: 80px; left: 120px; animation-delay: 0.5s; }
  .star:nth-child(3) { top: 160px; left: 200px; animation-delay: 1s; }
  .star:nth-child(4) { top: 60px; left: 180px; animation-delay: 1.5s; }
  .star:nth-child(5) { top: 200px; left: 60px; animation-delay: 2s; }
  .star:nth-child(6) { top: 30px; left: 100px; animation-delay: 0.3s; }
  .star:nth-child(7) { top: 120px; left: 30px; animation-delay: 1.2s; }
  .star:nth-child(8) { top: 180px; left: 150px; animation-delay: 0.8s; }
  .star:nth-child(9) { top: 100px; left: 200px; animation-delay: 1.7s; }
  .star:nth-child(10) { top: 50px; left: 220px; animation-delay: 0.6s; }
  .star:nth-child(11) { top: 170px; left: 90px; animation-delay: 1.1s; }
  .star:nth-child(12) { top: 140px; left: 170px; animation-delay: 0.9s; }
  .star:nth-child(13) { top: 40px; left: 180px; animation-delay: 1.3s; }
  .star:nth-child(14) { top: 190px; left: 120px; animation-delay: 0.7s; }
  .star:nth-child(15) { top: 70px; left: 60px; animation-delay: 1.4s; }
  @keyframes twinkle {
    0% { opacity: 0.8; }
    100% { opacity: 0.2; }
  }
`;

export default MaintenanceModal; 