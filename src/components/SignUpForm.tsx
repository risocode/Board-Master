import React from 'react';
import styled from 'styled-components';
import { signIn } from "next-auth/react";

const SignUpForm = () => {
  return (
    <StyledWrapper>
      <div className="accent-bar" />
      <form className="form" onSubmit={e => { e.preventDefault(); }}>
        <p>
          Welcome,<span>sign in to continue</span>
        </p>
        <button
          type="button"
          className="googleButton"
          onClick={() => signIn("google")}
        >
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          <span>Continue with Google</span>
        </button>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  background: #eaf4fb;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 8px 8px #1e293b;
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  max-width: 340px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .accent-bar {
    width: 60px;
    height: 7px;
    border-radius: 7px;
    background: linear-gradient(90deg, #60a5fa 0%, #38bdf8 100%);
    position: absolute;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 1.2rem;
    box-shadow: 0 2px 8px 0 rgba(33,150,243,0.10);
  }
  .form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-top: 1.8rem;
  }
  .form > p {
    font-family: var(--font-DelaGothicOne, 'Dela Gothic One', sans-serif);
    color: #181c24;
    font-weight: 800;
    font-size: 1.5rem;
    margin-bottom: 0.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .form > p > span {
    font-family: var(--font-SpaceMono, 'Space Mono', monospace);
    color: #3b4252;
    font-weight: 600;
    font-size: 1.1rem;
    margin-top: 0.2rem;
  }
  .googleButton {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    max-width: 260px;
    height: 48px;
    border-radius: 1rem;
    border: none;
    background: linear-gradient(90deg, #fff 0%, #e0f2fe 100%);
    box-shadow: 4px 4px #1e293b;
    font-size: 1.1rem;
    font-weight: 700;
    color: #181c24;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    margin-top: 0.5rem;
    margin-bottom: 0.2rem;
    outline: none;
    border: 2px solid #60a5fa;
  }
  .googleButton:hover {
    transform: scale(1.04) translateY(-2px);
    box-shadow: 6px 10px #38bdf8;
    background: linear-gradient(90deg, #e0f2fe 0%, #fff 100%);
    border-color: #38bdf8;
  }
  .icon {
    width: 1.7rem;
    height: 1.7rem;
    flex-shrink: 0;
  }
`;

export default SignUpForm; 