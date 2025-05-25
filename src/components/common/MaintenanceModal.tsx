import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

interface MaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  courseName?: string;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ open, onClose, courseName }) => {
  if (!open) return null;
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Card courseName={courseName} />
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

const Card: React.FC<{ courseName?: string }> = ({ courseName }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <Image
          src="https://uiverse.io/astronaut.png"
          alt="Astronaut"
          width={192}
          height={192}
          className="image"
          priority
        />
        {courseName && <div className="course-name">{courseName} <br /> <span className="is-label">Is Currently</span></div>}
        <div className="heading">Under Development</div>
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
`;

export default MaintenanceModal; 