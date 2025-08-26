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

  /* 전역 select 스타일 - 사파리 브라우저 호환성 */
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    
    /* 사파리에서 화살표 아이콘 제거 */
    &::-ms-expand {
      display: none;
    }
    
    /* 커스텀 화살표 아이콘 추가 */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px;
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
    background: #f0f0f0;
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
