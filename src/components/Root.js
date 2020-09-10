import React from 'react';
import { Global, css } from '@emotion/core';
import { ThemeProvider, CSSReset, theme, Text } from '@chakra-ui/core';
import WSView from './WSView';

export default function Root() {
  return (
    <>
      <Global
        styles={css`
        body {
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
      `}
      />
      <ThemeProvider theme={theme}>
        <CSSReset />
        <WSView />
      </ThemeProvider>
    </>
  );
}