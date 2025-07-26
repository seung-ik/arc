'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* CSS Reset */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  #root,
  #__next {
    isolation: isolate;
  }

  /* Remove list styles */
  ul,
  ol {
    list-style: none;
  }

  /* Remove text decoration from links */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Remove button styles */
  button {
    background: none;
    border: none;
    cursor: pointer;
  }

  /* Remove input styles */
  input,
  textarea {
    border: none;
    outline: none;
  }

  /* Remove table border spacing */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* Hide scrollbar but keep scroll functionality */
  html {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }

  html::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  body {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }

  body::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* Hide scrollbar for all scrollable elements */
  * {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }

  *::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

export default GlobalStyle;
