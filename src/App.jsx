import React from 'react';
import MainRouter from './MainRouter';
import Preloader from './Components/Common/Preloader';

function App() {
  return (
    <>
      {/* Global Preloader on Page Reload */}
      <Preloader />
      <MainRouter />
    </>
  );
}

export default App;