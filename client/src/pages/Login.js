import styled from "styled-components/macro";

const StyledLoginContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledLoginButton = styled.a`
  display: inline-block;
  background-color: var(--green);
  color: var(--white);
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--border-radius-pill);
  font-weight: 700;
  font-size: var(--fz-lg);

  &hover,
  &focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

const login = () => (
  <StyledLoginContainer>
    <h1>Placeholder Name</h1>
    <StyledLoginButton href="http://localhost:8888/login">
      Log in to Spotify
    </StyledLoginButton>
  </StyledLoginContainer>
);

export default login;
